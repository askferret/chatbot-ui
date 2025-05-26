import { ModelProvider } from "."

export type LLMID =
  | OpenAILLMID
  | GoogleLLMID
  | AnthropicLLMID
  | MistralLLMID
  | GroqLLMID
  | PerplexityLLMID

// OpenAI Models (UPDATED 5/13/24)
export type OpenAILLMID = string

// Google Models
export type GoogleLLMID = string

// Anthropic Models
export type AnthropicLLMID = string

// Mistral Models
export type MistralLLMID = string

export type GroqLLMID = string

// Perplexity Models (UPDATED 1/31/24)
export type PerplexityLLMID = string

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
