import { LLM } from "@/types"

const GOOGLE_PLATORM_LINK = "https://ai.google.dev/gemini-api/docs/models"

/**
 * Google Gemini Models (UPDATED 05/2025)
 * @see https://ai.google.dev/gemini-api/docs/models
 * @type {LLM[]}
 */
const GEMINI_2_5_PRO: LLM = {
  modelId: "gemini-2.5-pro-preview-05-06",
  modelName: "Gemini 2.5 Pro Preview",
  provider: "google",
  hostedId: "gemini-2.5-pro-preview-05-06",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

const GEMINI_2_5_FLASH: LLM = {
  modelId: "gemini-2.5-flash-preview-05-20",
  modelName: "Gemini 2.5 Flash Preview",
  provider: "google",
  hostedId: "gemini-2.5-flash-preview-05-20",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

const GEMINI_2_0_FLASH: LLM = {
  modelId: "gemini-2.0-flash",
  modelName: "Gemini 2.0 Flash",
  provider: "google",
  hostedId: "gemini-2.0-flash",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

const GEMINI_1_5_PRO: LLM = {
  modelId: "gemini-1.5-pro-latest",
  modelName: "Gemini 1.5 Pro",
  provider: "google",
  hostedId: "gemini-1.5-pro-latest",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

const GEMINI_1_5_FLASH: LLM = {
  modelId: "gemini-1.5-flash",
  modelName: "Gemini 1.5 Flash",
  provider: "google",
  hostedId: "gemini-1.5-flash",
  platformLink: GOOGLE_PLATORM_LINK,
  imageInput: true
}

/**
 * List of all supported Google Gemini models (May 2025)
 * @type {LLM[]}
 */
export const GOOGLE_LLM_LIST: LLM[] = [
  GEMINI_2_5_PRO,
  GEMINI_2_5_FLASH,
  GEMINI_2_0_FLASH,
  GEMINI_1_5_PRO,
  GEMINI_1_5_FLASH
]
