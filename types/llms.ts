import { ModelProvider } from "."

/**
 * All supported LLM model IDs for the application.
 * @typedef {string} LLMID
 */
export type LLMID =
  | OpenAILLMID
  | GoogleLLMID
  | AnthropicLLMID
  | MistralLLMID
  | GroqLLMID
  | PerplexityLLMID

/**
 * OpenAI Model IDs (UPDATED 05/2025)
 * @see https://platform.openai.com/docs/models
 */
export type OpenAILLMID =
  | "gpt-4o" // GPT-4o
  | "gpt-4.1" // GPT-4.1
  | "gpt-4.1-mini" // GPT-4.1 Mini
  | "gpt-4.1-nano" // GPT-4.1 Nano
  | "o3-mini" // O3 Mini
  | "gpt-4o-mini-audio-preview" // GPT-4o Mini Audio Preview

/**
 * Google Model IDs (UPDATED 05/2025)
 * @see https://ai.google.dev/gemini-api/docs/models
 */
export type GoogleLLMID =
  | "gemini-2.5-pro-preview-05-06" // Gemini 2.5 Pro Preview
  | "gemini-2.5-flash-preview-05-20" // Gemini 2.5 Flash Preview
  | "gemini-2.0-flash" // Gemini 2.0 Flash
  | "gemini-1.5-pro-latest" // Gemini 1.5 Pro
  | "gemini-1.5-flash" // Gemini 1.5 Flash

/**
 * Anthropic Model IDs (UPDATED 05/2025)
 * @see https://docs.anthropic.com/en/docs/about-claude/models/overview
 */
export type AnthropicLLMID =
  | "claude-opus-4-20250514" // Claude Opus 4
  | "claude-sonnet-4-20250514" // Claude Sonnet 4
  | "claude-3-7-sonnet-latest" // Claude Sonnet 3.7
  | "claude-3-5-haiku-latest" // Claude Haiku 3.5
  | "claude-3-5-sonnet-latest" // Claude Sonnet 3.5 v2

// Mistral Models
export type MistralLLMID =
  | "mistral-tiny" // Mistral Tiny
  | "mistral-small-latest" // Mistral Small
  | "mistral-medium-latest" // Mistral Medium
  | "mistral-large-latest" // Mistral Large

export type GroqLLMID =
  | "llama3-8b-8192" // LLaMA3-8b
  | "llama3-70b-8192" // LLaMA3-70b
  | "mixtral-8x7b-32768" // Mixtral-8x7b
  | "gemma-7b-it" // Gemma-7b IT

// Perplexity Models (UPDATED 1/31/24)
export type PerplexityLLMID =
  | "pplx-7b-online" // Perplexity Online 7B
  | "pplx-70b-online" // Perplexity Online 70B
  | "pplx-7b-chat" // Perplexity Chat 7B
  | "pplx-70b-chat" // Perplexity Chat 70B
  | "mixtral-8x7b-instruct" // Mixtral 8x7B Instruct
  | "mistral-7b-instruct" // Mistral 7B Instruct
  | "llama-2-70b-chat" // Llama2 70B Chat
  | "codellama-34b-instruct" // CodeLlama 34B Instruct
  | "codellama-70b-instruct" // CodeLlama 70B Instruct
  | "sonar-small-chat" // Sonar Small Chat
  | "sonar-small-online" // Sonar Small Online
  | "sonar-medium-chat" // Sonar Medium Chat
  | "sonar-medium-online" // Sonar Medium Online

export interface LLM {
  modelId: LLMID
  modelName: string
  provider: ModelProvider
  hostedId: string
  platformLink: string
  imageInput: boolean
  pricing?: {
    currency: string
    unit: string
    inputCost: number
    outputCost?: number
  }
}

export interface OpenRouterLLM extends LLM {
  maxContext: number
}
