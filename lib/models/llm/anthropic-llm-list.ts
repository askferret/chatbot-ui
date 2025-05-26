import { LLM } from "@/types"

const ANTHROPIC_PLATFORM_LINK =
  "https://docs.anthropic.com/claude/reference/getting-started-with-the-api"

/**
 * Anthropic Claude Models (UPDATED 05/2025)
 * @see https://docs.anthropic.com/en/docs/about-claude/models/overview
 * @type {LLM[]}
 */
const CLAUDE_OPUS_4: LLM = {
  modelId: "claude-opus-4-20250514",
  modelName: "Claude Opus 4",
  provider: "anthropic",
  hostedId: "claude-opus-4-20250514",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 15,
    outputCost: 75
  }
}

const CLAUDE_SONNET_4: LLM = {
  modelId: "claude-sonnet-4-20250514",
  modelName: "Claude Sonnet 4",
  provider: "anthropic",
  hostedId: "claude-sonnet-4-20250514",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

const CLAUDE_3_7_SONNET: LLM = {
  modelId: "claude-3-7-sonnet-latest",
  modelName: "Claude Sonnet 3.7",
  provider: "anthropic",
  hostedId: "claude-3-7-sonnet-latest",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

const CLAUDE_3_5_HAIKU: LLM = {
  modelId: "claude-3-5-haiku-latest",
  modelName: "Claude Haiku 3.5",
  provider: "anthropic",
  hostedId: "claude-3-5-haiku-latest",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 0.8,
    outputCost: 4
  }
}

const CLAUDE_3_5_SONNET_V2: LLM = {
  modelId: "claude-3-5-sonnet-latest",
  modelName: "Claude Sonnet 3.5 v2",
  provider: "anthropic",
  hostedId: "claude-3-5-sonnet-latest",
  platformLink: ANTHROPIC_PLATFORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

/**
 * List of all supported Anthropic Claude models (May 2025)
 * @type {LLM[]}
 */
export const ANTHROPIC_LLM_LIST: LLM[] = [
  CLAUDE_OPUS_4,
  CLAUDE_SONNET_4,
  CLAUDE_3_7_SONNET,
  CLAUDE_3_5_HAIKU,
  CLAUDE_3_5_SONNET_V2
]
