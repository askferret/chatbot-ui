import { LLM } from "@/types"
import OpenAI from "openai"
import Anthropic from "@anthropic-ai/sdk"

/**
 * Fetches available models from OpenAI using the user's API key.
 * @param apiKey OpenAI API key
 * @param orgId (optional) OpenAI organization ID
 * @returns Array of LLMs
 */
export async function fetchOpenAIModels(
  apiKey: string,
  orgId?: string
): Promise<LLM[]> {
  try {
    const openai = new OpenAI({ apiKey, organization: orgId })
    const response = await openai.models.list()
    // Map OpenAI API response to internal LLM type
    return response.data.map((model: any) => ({
      modelId: model.id,
      modelName: model.id,
      provider: "openai",
      hostedId: model.id,
      platformLink: "https://platform.openai.com/docs/overview",
      imageInput: false // OpenAI API does not provide this info
    }))
  } catch (error) {
    console.error("[fetchOpenAIModels] Error fetching OpenAI models:", error)
    return []
  }
}

/**
 * Fetches available models from Anthropic using the user's API key.
 * @param apiKey Anthropic API key
 * @returns Array of LLMs
 */
export async function fetchAnthropicModels(apiKey: string): Promise<LLM[]> {
  try {
    const anthropic = new Anthropic({ apiKey })
    // Anthropic SDK does not expose a models.list, so use fetch
    const response = await fetch("https://api.anthropic.com/v1/models", {
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      }
    })
    if (!response.ok) throw new Error("Anthropic API error: " + response.status)
    const data = await response.json()
    // Map Anthropic API response to internal LLM type
    return (data.models || []).map((model: any) => ({
      modelId: model.id,
      modelName: model.name || model.id,
      provider: "anthropic",
      hostedId: model.id,
      platformLink:
        "https://docs.anthropic.com/claude/reference/getting-started-with-the-api",
      imageInput: false // Anthropic API does not provide this info
    }))
  } catch (error) {
    console.error(
      "[fetchAnthropicModels] Error fetching Anthropic models:",
      error
    )
    return []
  }
}
