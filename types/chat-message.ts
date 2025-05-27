import { Tables } from "@/supabase/types"
import { ToolOutputType } from "./tool-output-type"

export interface ChatMessage {
  message: Tables<"messages"> & {
    toolOutputType?: ToolOutputType
    meta?: Record<string, any>
  }
  fileItems: string[]
}
