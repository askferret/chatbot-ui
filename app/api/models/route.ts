import { getServerProfile } from "@/lib/server/server-chat-helpers"
import { NextResponse } from "next/server"
import { LLM } from "@/types"
import {
  fetchOpenAIModels,
  fetchAnthropicModels
} from "@/lib/server/fetch-provider-models"
import { GOOGLE_LLM_LIST } from "@/lib/models/llm/google-llm-list"
import { MISTRAL_LLM_LIST } from "@/lib/models/llm/mistral-llm-list"
import { GROQ_LLM_LIST } from "@/lib/models/llm/groq-llm-list"
import { PERPLEXITY_LLM_LIST } from "@/lib/models/llm/perplexity-llm-list"
import { OPENAI_LLM_LIST } from "@/lib/models/llm/openai-llm-list"
import { ANTHROPIC_LLM_LIST } from "@/lib/models/llm/anthropic-llm-list"

/**
 * GET /api/models
 * Returns all available models for the current user, based on their API keys.
 * For OpenAI and Anthropic, dynamically queries the provider's API for available models.
 * Each model includes its provider and metadata.
 *
 * @returns {LLM[]} Array of available models
 * @example
 * // GET /api/models
 * // Response: [{ modelId: "gpt-4o", modelName: "GPT-4o", provider: "openai", ... }, ...]
 */
export async function GET() {
  try {
    const profile = await getServerProfile()
    let models: LLM[] = []

    // OpenAI: dynamically fetch models
    if (profile.openai_api_key) {
      try {
        const openaiModels = await fetchOpenAIModels(
          profile.openai_api_key,
          profile.openai_organization_id || undefined
        )
        if (openaiModels.length > 0) {
          models.push(...openaiModels)
        } else {
          // fallback to static list
          models.push(...OPENAI_LLM_LIST)
          console.warn(
            "[GET /api/models] Falling back to static OpenAI model list."
          )
        }
      } catch (err) {
        models.push(...OPENAI_LLM_LIST)
        console.error(
          "[GET /api/models] Error fetching OpenAI models, using static list:",
          err
        )
      }
    }

    // Anthropic: dynamically fetch models
    if (profile.anthropic_api_key) {
      try {
        const anthropicModels = await fetchAnthropicModels(
          profile.anthropic_api_key
        )
        if (anthropicModels.length > 0) {
          models.push(...anthropicModels)
        } else {
          // fallback to static list
          models.push(...ANTHROPIC_LLM_LIST)
          console.warn(
            "[GET /api/models] Falling back to static Anthropic model list."
          )
        }
      } catch (err) {
        models.push(...ANTHROPIC_LLM_LIST)
        console.error(
          "[GET /api/models] Error fetching Anthropic models, using static list:",
          err
        )
      }
    }

    // Other providers: use static lists for now
    if (profile.google_gemini_api_key) {
      models.push(...GOOGLE_LLM_LIST)
    }
    if (profile.mistral_api_key) {
      models.push(...MISTRAL_LLM_LIST)
    }
    if (profile.groq_api_key) {
      models.push(...GROQ_LLM_LIST)
    }
    if (profile.perplexity_api_key) {
      models.push(...PERPLEXITY_LLM_LIST)
    }
    // Add more providers as needed

    return NextResponse.json({ models }, { status: 200 })
  } catch (error: any) {
    console.error("Error in /api/models:", error)
    return NextResponse.json(
      { message: error?.message || "An unexpected error occurred" },
      { status: 500 }
    )
  }
}
