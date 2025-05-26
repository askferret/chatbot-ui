import { LLM } from "@/types"

const OPENAI_PLATORM_LINK = "https://platform.openai.com/docs/overview"

/**
 * OpenAI Models (UPDATED 05/2025)
 * @see https://platform.openai.com/docs/models
 * @type {LLM[]}
 */
const GPT4O: LLM = {
  modelId: "gpt-4o",
  modelName: "GPT-4o",
  provider: "openai",
  hostedId: "gpt-4o",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 5,
    outputCost: 15
  }
}

const GPT41: LLM = {
  modelId: "gpt-4.1",
  modelName: "GPT-4.1",
  provider: "openai",
  hostedId: "gpt-4.1",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 10,
    outputCost: 30
  }
}

const GPT41MINI: LLM = {
  modelId: "gpt-4.1-mini",
  modelName: "GPT-4.1 Mini",
  provider: "openai",
  hostedId: "gpt-4.1-mini",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 2,
    outputCost: 6
  }
}

const GPT41NANO: LLM = {
  modelId: "gpt-4.1-nano",
  modelName: "GPT-4.1 Nano",
  provider: "openai",
  hostedId: "gpt-4.1-nano",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 1,
    outputCost: 3
  }
}

const O3MINI: LLM = {
  modelId: "o3-mini",
  modelName: "O3 Mini",
  provider: "openai",
  hostedId: "o3-mini",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.5,
    outputCost: 1.5
  }
}

const GPT4O_MINI_AUDIO_PREVIEW: LLM = {
  modelId: "gpt-4o-mini-audio-preview",
  modelName: "GPT-4o Mini Audio Preview",
  provider: "openai",
  hostedId: "gpt-4o-mini-audio-preview",
  platformLink: OPENAI_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.5,
    outputCost: 1.5
  }
}

/**
 * List of all supported OpenAI models (May 2025)
 * @type {LLM[]}
 */
export const OPENAI_LLM_LIST: LLM[] = [
  GPT4O,
  GPT41,
  GPT41MINI,
  GPT41NANO,
  O3MINI,
  GPT4O_MINI_AUDIO_PREVIEW
]
