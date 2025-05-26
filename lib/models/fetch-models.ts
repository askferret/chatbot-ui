import { LLM, LLMID, OpenRouterLLM } from "@/types"
import { toast } from "sonner"

/**
 * Fetches all hosted models available to the current user from the unified /api/models endpoint.
 * Returns an array of LLMs (hosted models from all providers the user has keys for).
 *
 * @returns {Promise<LLM[]>} Array of available hosted models
 * @example
 * const models = await fetchHostedModels(); jjjnh
 * // models: [{ modelId: "gpt-4o", modelName: "GPT-4o", provider: "openai", ... }, ...]
 */
export const fetchHostedModels = async (): Promise<LLM[]> => {
  try {
    const response = await fetch("/api/models")
    if (!response.ok) {
      throw new Error("Failed to fetch hosted models from /api/models.")
    }
    const { models } = await response.json()
    return models as LLM[]
  } catch (error) {
    console.error("Error fetching hosted models:", error)
    toast.error("Error fetching hosted models: " + error)
    return []
  }
}

export const fetchOllamaModels = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_OLLAMA_URL + "/api/tags"
    )

    if (!response.ok) {
      throw new Error(`Ollama server is not responding.`)
    }

    const data = await response.json()

    const localModels: LLM[] = data.models.map((model: any) => ({
      modelId: model.name as LLMID,
      modelName: model.name,
      provider: "ollama",
      hostedId: model.name,
      platformLink: "https://ollama.ai/library",
      imageInput: false
    }))

    return localModels
  } catch (error) {
    console.warn("Error fetching Ollama models: " + error)
  }
}

export const fetchOpenRouterModels = async () => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models")

    if (!response.ok) {
      throw new Error(`OpenRouter server is not responding.`)
    }

    const { data } = await response.json()

    const openRouterModels = data.map(
      (model: {
        id: string
        name: string
        context_length: number
      }): OpenRouterLLM => ({
        modelId: model.id as LLMID,
        modelName: model.id,
        provider: "openrouter",
        hostedId: model.name,
        platformLink: "https://openrouter.dev",
        imageInput: false,
        maxContext: model.context_length
      })
    )

    return openRouterModels
  } catch (error) {
    console.error("Error fetching Open Router models: " + error)
    toast.error("Error fetching Open Router models: " + error)
  }
}
