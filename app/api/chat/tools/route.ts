import { openapiToFunctions } from "@/lib/openapi-conversion"
import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { Tables } from "@/supabase/types"
import { ChatSettings } from "@/types"
import { OpenAIStream, StreamingTextResponse } from "ai"
import OpenAI from "openai"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages, selectedTools } = json as {
    chatSettings: ChatSettings
    messages: any[]
    selectedTools: Tables<"tools">[]
  }
  console.log(
    "[TOOLS_API] Received request. Selected Tools:",
    selectedTools.map(t => t.name)
  )
  console.log(
    "[TOOLS_API] Initial messages:",
    JSON.stringify(messages.slice(-2), null, 2)
  ) // Log last 2 messages

  try {
    const profile = await getServerProfile()

    checkApiKey(profile.openai_api_key, "OpenAI")

    const openai = new OpenAI({
      apiKey: profile.openai_api_key || "",
      organization: profile.openai_organization_id
    })

    let allTools: OpenAI.Chat.Completions.ChatCompletionTool[] = []
    let allRouteMaps = {}
    let schemaDetails = []

    for (const selectedTool of selectedTools) {
      try {
        const convertedSchema = await openapiToFunctions(
          JSON.parse(selectedTool.schema as string)
        )
        const tools = convertedSchema.functions || []
        allTools = allTools.concat(tools)

        const routeMap = convertedSchema.routes.reduce(
          (map: Record<string, string>, route) => {
            map[route.path.replace(/{(\w+)}/g, ":$1")] = route.operationId
            return map
          },
          {}
        )

        allRouteMaps = { ...allRouteMaps, ...routeMap }

        schemaDetails.push({
          title: convertedSchema.info.title,
          description: convertedSchema.info.description,
          url: convertedSchema.info.server,
          headers: selectedTool.custom_headers,
          routeMap,
          requestInBody: convertedSchema.routes[0].requestInBody
        })
      } catch (error: any) {
        console.error(
          "Error converting schema for tool:",
          selectedTool.name,
          error
        )
        // Optionally, continue to next tool or return an error response for this tool
      }
    }

    console.log(
      "[TOOLS_API] Tools prepared for LLM:",
      JSON.stringify(allTools, null, 2)
    )

    const firstResponse = await openai.chat.completions.create({
      model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
      messages,
      tools: allTools.length > 0 ? allTools : undefined,
      tool_choice: allTools.length > 0 ? "auto" : undefined
    })

    const message = firstResponse.choices[0].message
    console.log(
      "[TOOLS_API] LLM first response message:",
      JSON.stringify(message, null, 2)
    )
    messages.push(message) // Add LLM response (which may include tool calls) to messages array
    const toolCalls = message.tool_calls || []

    if (toolCalls.length === 0) {
      if (message.content) {
        return new Response(
          JSON.stringify({
            toolOutputType: "markdown",
            content: message.content,
            meta: { source: "llmDirectResponse" }
          }),
          { headers: { "Content-Type": "application/json" } }
        )
      } else {
        return new Response(
          JSON.stringify({
            toolOutputType: "error",
            content: "LLM returned no content and no tool calls.",
            meta: { source: "llmDirectResponse", errorCode: "NO_LLM_CONTENT" }
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        )
      }
    }

    // If there are tool calls, process them
    if (toolCalls.length > 0) {
      console.log(
        "[TOOLS_API] LLM wants to call tools:",
        JSON.stringify(toolCalls, null, 2)
      )
      for (const toolCall of toolCalls) {
        const functionCall = toolCall.function
        const functionName = functionCall.name
        const argumentsString = toolCall.function.arguments.trim()
        const parsedArgs = JSON.parse(argumentsString)

        const schemaDetail = schemaDetails.find(detail =>
          Object.values(detail.routeMap).includes(functionName)
        )

        if (!schemaDetail) {
          // This specific tool call cannot be processed, add an error message for it
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify({
              error: `Function ${functionName} not found in any schema.`,
              toolOutputType: "error",
              meta: { toolName: functionName, errorCode: "SCHEMA_NOT_FOUND" }
            })
          })
          continue // Continue to the next tool call if any
        }

        const pathTemplate = Object.keys(schemaDetail.routeMap).find(
          key => schemaDetail.routeMap[key] === functionName
        )

        if (!pathTemplate) {
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify({
              error: `Path for function ${functionName} not found.`,
              toolOutputType: "error",
              meta: { toolName: functionName, errorCode: "PATH_NOT_FOUND" }
            })
          })
          continue
        }

        const path = pathTemplate.replace(/:(\w+)/g, (_, paramName) => {
          const value = parsedArgs.parameters[paramName]
          if (!value) {
            console.warn(
              `Missing parameter ${paramName} for function ${functionName}`
            )
            return ""
          }
          return encodeURIComponent(value)
        })

        let externalToolResponse: globalThis.Response
        try {
          console.log(
            `[TOOLS_API] Calling tool: ${functionName} for tool ID: ${toolCall.id}. Arguments: ${JSON.stringify(parsedArgs, null, 2)}. Schema Details: ${JSON.stringify(schemaDetail, null, 2)}`
          )

          // Special handling for mermaid.ink if this is the mermaid tool
          if (
            functionName === "renderMermaidDiagram" &&
            schemaDetail.url === "https://mermaid.ink"
          ) {
            const mermaidCode =
              parsedArgs.code ||
              (parsedArgs.requestBody && parsedArgs.requestBody.code)
            if (!mermaidCode) {
              throw new Error(
                "Mermaid code is missing in arguments for renderMermaidDiagram."
              )
            }
            // mermaid.ink expects the diagram to be base64 encoded in the URL path for SVGs
            // Standard Base64 encoding, then make it URL-safe
            const base64Mermaid = Buffer.from(mermaidCode)
              .toString("base64")
              .replace(/\+/g, "-") // Convert '+' to '-'
              .replace(/\//g, "_") // Convert '/' to '_'
              .replace(/=+$/, "") // Remove trailing '='

            const mermaidInkUrl = `${schemaDetail.url}/svg/${base64Mermaid}`
            console.log(
              `[TOOLS_API] Constructed mermaid.ink GET URL: ${mermaidInkUrl}`
            )
            externalToolResponse = await fetch(mermaidInkUrl, { method: "GET" })
          } else if (schemaDetail.requestInBody) {
            let headers = { "Content-Type": "application/json" }
            if (
              schemaDetail.headers &&
              typeof schemaDetail.headers === "string"
            ) {
              try {
                headers = { ...headers, ...JSON.parse(schemaDetail.headers) }
              } catch (e) {
                console.error("Failed to parse custom headers", e)
              }
            }
            const fullUrl = schemaDetail.url + path
            const bodyContent = parsedArgs.requestBody || parsedArgs
            externalToolResponse = await fetch(fullUrl, {
              method: "POST",
              headers,
              body: JSON.stringify(bodyContent)
            })
          } else {
            const queryParams = new URLSearchParams(
              parsedArgs.parameters
            ).toString()
            const fullUrl =
              schemaDetail.url + path + (queryParams ? "?" + queryParams : "")
            let headers = {}
            if (
              schemaDetail.headers &&
              typeof schemaDetail.headers === "string"
            ) {
              try {
                headers = JSON.parse(schemaDetail.headers)
              } catch (e) {
                console.error("Failed to parse custom headers", e)
              }
            }
            externalToolResponse = await fetch(fullUrl, {
              method: "GET",
              headers
            })
          }

          console.log(
            `[TOOLS_API] Response from tool ${functionName} (ID: ${toolCall.id}): Status: ${externalToolResponse.status}, Content-Type: ${externalToolResponse.headers.get("Content-Type")}`
          )

          const externalToolContentType =
            externalToolResponse.headers.get("Content-Type")

          if (
            externalToolContentType &&
            externalToolContentType.includes("image/svg+xml")
          ) {
            const svgContent = await externalToolResponse.text()
            // If a tool returns SVG, we return this directly to the client.
            return new Response(
              JSON.stringify({
                toolOutputType: "svg",
                content: svgContent,
                meta: {
                  toolName: functionName,
                  schemaTitle: schemaDetail.title
                }
              }),
              { headers: { "Content-Type": "application/json" } }
            )
          }

          if (!externalToolResponse.ok) {
            const errorText = await externalToolResponse.text()
            messages.push({
              tool_call_id: toolCall.id,
              role: "tool",
              name: functionName,
              content: JSON.stringify({
                error: `Tool ${functionName} failed with status ${externalToolResponse.status}. Details: ${errorText || externalToolResponse.statusText}`,
                toolOutputType: "error", // Ensure client can render this as an error
                meta: {
                  toolName: functionName,
                  errorCode: `TOOL_HTTP_${externalToolResponse.status}`,
                  details: errorText || externalToolResponse.statusText
                }
              })
            })
            continue // Move to next tool call if there are multiple
          }

          // For other content types (e.g., JSON, text) that will be processed by LLM further
          let toolData
          if (
            externalToolContentType &&
            externalToolContentType.includes("application/json")
          ) {
            toolData = await externalToolResponse.json()
          } else {
            toolData = { textContent: await externalToolResponse.text() } // Wrap non-JSON in an object
          }
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify(toolData) // LLM expects content to be a string
          })
        } catch (error: any) {
          console.error(
            `Error during tool execution for ${functionName}:`,
            error
          )
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: JSON.stringify({
              error: `Exception during tool execution for ${functionName}: ${error.message}`,
              toolOutputType: "error",
              meta: {
                toolName: functionName,
                errorCode: "TOOL_EXECUTION_EXCEPTION",
                details: error.stack
              }
            })
          })
          continue // Continue to next tool call
        }
      } // end of for loop for toolCalls

      // After processing all tool calls (those that didn't return directly),
      // make a second call to OpenAI with the tool responses included in messages.
      const secondResponse = await openai.chat.completions.create({
        model: chatSettings.model as ChatCompletionCreateParamsBase["model"],
        messages
        // Removed tools and tool_choice for the second call as per OpenAI guidance
        // if we only want the LLM to synthesize based on tool responses.
      })

      const finalMessage = secondResponse.choices[0].message
      if (finalMessage.content) {
        return new Response(
          JSON.stringify({
            toolOutputType: "markdown",
            content: finalMessage.content,
            meta: { source: "llmProcessedToolResponse" }
          }),
          { headers: { "Content-Type": "application/json" } }
        )
      } else {
        // Handle cases where the second LLM response might be empty or another tool_call (less common)
        return new Response(
          JSON.stringify({
            toolOutputType: "error",
            content: "LLM returned no content after processing tool responses.",
            meta: {
              source: "llmProcessedToolResponse",
              errorCode: "NO_FINAL_LLM_CONTENT"
            }
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        )
      }
    }

    // Fallback for unexpected scenarios (should ideally not be reached if logic above is exhaustive)
    return new Response(
      JSON.stringify({
        toolOutputType: "error",
        content: "An unexpected error occurred in the tools API.",
        meta: { errorCode: "UNEXPECTED_API_ERROR" }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  } catch (error: any) {
    console.error("OpenAI Tools API error:", error)
    const errorMessage = error.message || "An unexpected error occurred."
    const errorCode = error.code || "OPENAI_API_ERROR"
    return new Response(
      JSON.stringify({
        toolOutputType: "error",
        content: errorMessage,
        meta: { errorCode, details: error.stack }
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}
