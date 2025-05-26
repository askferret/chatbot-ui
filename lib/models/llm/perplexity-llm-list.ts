import { LLM } from "@/types"

const PERPLEXITY_PLATORM_LINK = "https://docs.perplexity.ai/models/model-cards"

/**
 * Perplexity Models (UPDATED 05/2025)
 * @see https://docs.perplexity.ai/models/model-cards
 * @type {LLM[]}
 */
const PPLX_70B_ONLINE: LLM = {
  modelId: "pplx-70b-online",
  modelName: "Perplexity Online 70B",
  provider: "perplexity",
  hostedId: "pplx-70b-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const PPLX_70B_CHAT: LLM = {
  modelId: "pplx-70b-chat",
  modelName: "Perplexity Chat 70B",
  provider: "perplexity",
  hostedId: "pplx-70b-chat",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const MIXTRAL_8X7B_INSTRUCT: LLM = {
  modelId: "mixtral-8x7b-instruct",
  modelName: "Mixtral 8x7B Instruct",
  provider: "perplexity",
  hostedId: "mixtral-8x7b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const MISTRAL_7B_INSTRUCT: LLM = {
  modelId: "mistral-7b-instruct",
  modelName: "Mistral 7B Instruct",
  provider: "perplexity",
  hostedId: "mistral-7b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const CODELLAMA_70B_INSTRUCT: LLM = {
  modelId: "codellama-70b-instruct",
  modelName: "CodeLlama 70B Instruct",
  provider: "perplexity",
  hostedId: "codellama-70b-instruct",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const SONAR_SMALL_CHAT: LLM = {
  modelId: "sonar-small-chat",
  modelName: "Sonar Small Chat",
  provider: "perplexity",
  hostedId: "sonar-small-chat",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const SONAR_SMALL_ONLINE: LLM = {
  modelId: "sonar-small-online",
  modelName: "Sonar Small Online",
  provider: "perplexity",
  hostedId: "sonar-small-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const SONAR_MEDIUM_CHAT: LLM = {
  modelId: "sonar-medium-chat",
  modelName: "Sonar Medium Chat",
  provider: "perplexity",
  hostedId: "sonar-medium-chat",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

const SONAR_MEDIUM_ONLINE: LLM = {
  modelId: "sonar-medium-online",
  modelName: "Sonar Medium Online",
  provider: "perplexity",
  hostedId: "sonar-medium-online",
  platformLink: PERPLEXITY_PLATORM_LINK,
  imageInput: false
}

/**
 * List of all supported Perplexity models (May 2025)
 * @type {LLM[]}
 */
export const PERPLEXITY_LLM_LIST: LLM[] = [
  PPLX_70B_ONLINE,
  PPLX_70B_CHAT,
  MIXTRAL_8X7B_INSTRUCT,
  MISTRAL_7B_INSTRUCT,
  CODELLAMA_70B_INSTRUCT,
  SONAR_SMALL_CHAT,
  SONAR_SMALL_ONLINE,
  SONAR_MEDIUM_CHAT,
  SONAR_MEDIUM_ONLINE
]
