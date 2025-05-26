"use client"

import { ChatbotUIContext } from "@/context/context"
import { CHAT_SETTING_LIMITS } from "@/lib/chat-setting-limits"
import { ChatSettings } from "@/types"
import { IconInfoCircle, IconAlertTriangle } from "@tabler/icons-react"
import { FC, useContext, useState, useEffect, useRef } from "react"
import { ModelSelect } from "../models/model-select"
import { AdvancedSettings } from "./advanced-settings"
import { Checkbox } from "./checkbox"
import { Label } from "./label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./select"
import { Slider } from "./slider"
import { TextareaAutosize } from "./textarea-autosize"
import { WithTooltip } from "./with-tooltip"

interface ChatSettingsFormProps {
  chatSettings: ChatSettings
  onChangeChatSettings: (value: ChatSettings) => void
  useAdvancedDropdown?: boolean
  showTooltip?: boolean
}

export const ChatSettingsForm: FC<ChatSettingsFormProps> = ({
  chatSettings,
  onChangeChatSettings,
  useAdvancedDropdown = true,
  showTooltip = true
}) => {
  const { profile, models } = useContext(ChatbotUIContext)

  if (!profile) return null

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>Model</Label>

        <ModelSelect
          selectedModelId={chatSettings.model}
          onSelectModel={model => {
            onChangeChatSettings({ ...chatSettings, model })
          }}
        />
      </div>

      <div className="space-y-1">
        <Label>Prompt</Label>

        <TextareaAutosize
          className="bg-background border-input border-2"
          placeholder="You are a helpful AI assistant."
          onValueChange={prompt => {
            onChangeChatSettings({ ...chatSettings, prompt })
          }}
          value={chatSettings.prompt}
          minRows={3}
          maxRows={6}
        />
      </div>

      {useAdvancedDropdown ? (
        <AdvancedSettings>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </AdvancedSettings>
      ) : (
        <div>
          <AdvancedContent
            chatSettings={chatSettings}
            onChangeChatSettings={onChangeChatSettings}
            showTooltip={showTooltip}
          />
        </div>
      )}
    </div>
  )
}

interface AdvancedContentProps {
  chatSettings: ChatSettings
  onChangeChatSettings: (value: ChatSettings) => void
  showTooltip: boolean
}

const AdvancedContent: FC<AdvancedContentProps> = ({
  chatSettings,
  onChangeChatSettings,
  showTooltip
}) => {
  const { profile, selectedWorkspace, availableOpenRouterModels, models } =
    useContext(ChatbotUIContext)

  const isCustomModel = models.some(
    model => model.model_id === chatSettings.model
  )

  function findOpenRouterModel(modelId: string) {
    return availableOpenRouterModels.find(model => model.modelId === modelId)
  }

  const MODEL_LIMITS = CHAT_SETTING_LIMITS[chatSettings.model] || {
    MIN_TEMPERATURE: 0,
    MAX_TEMPERATURE: 1,
    MAX_CONTEXT_LENGTH:
      findOpenRouterModel(chatSettings.model)?.maxContext || 32768
  }

  const [contextInput, setContextInput] = useState<number>(
    chatSettings.contextLength || 8192
  )
  const [inputError, setInputError] = useState<string>("")
  const [showClampMessage, setShowClampMessage] = useState<boolean>(false)
  const prevModelRef = useRef<string>("")

  const presetContextLengths = [4096, 8192, 32768, 128000]

  const modelSummary = (() => {
    const model = models.find(m => m.model_id === chatSettings.model)
    const llm = availableOpenRouterModels.find(
      m => m.modelId === chatSettings.model
    )
    const capabilities = []
    if (llm?.imageInput) capabilities.push("Vision")
    return [
      `Max Context: ${isCustomModel ? model?.context_length : MODEL_LIMITS.MAX_CONTEXT_LENGTH}`,
      `Max Output: ${MODEL_LIMITS.MAX_TOKEN_OUTPUT_LENGTH}`,
      ...(capabilities.length ? [capabilities.join(", ")] : [])
    ].join(" | ")
  })()

  useEffect(() => {
    setContextInput(chatSettings.contextLength)
  }, [chatSettings.contextLength])

  useEffect(() => {
    if (prevModelRef.current && prevModelRef.current !== chatSettings.model) {
      // Optionally, add a CSS class for animation or trigger a re-render
      // (Implementation depends on your slider component)
    }
    prevModelRef.current = chatSettings.model
  }, [chatSettings.model])

  const handleContextInputChange = (val: string) => {
    const num = parseInt(val, 10)
    if (!isNaN(num) && num >= 0) {
      setInputError("")
      setContextInput(num)
      onChangeChatSettings({
        ...chatSettings,
        contextLength: Math.max(
          0,
          Math.min(num, MODEL_LIMITS.MAX_CONTEXT_LENGTH)
        )
      })
    } else {
      setInputError("Please enter a valid non-negative number.")
    }
  }

  const handleContextInputBlur = () => {
    const clamped = Math.max(
      0,
      Math.min(
        contextInput,
        isCustomModel
          ? models.find(model => model.model_id === chatSettings.model)
              ?.context_length || MODEL_LIMITS.MAX_CONTEXT_LENGTH
          : MODEL_LIMITS.MAX_CONTEXT_LENGTH
      )
    )
    if (contextInput !== clamped) {
      setShowClampMessage(true)
      setTimeout(() => setShowClampMessage(false), 3000)
    }
    setContextInput(clamped)
    onChangeChatSettings({
      ...chatSettings,
      contextLength: clamped
    })
  }

  const handleContextInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleContextInputBlur()
    }
  }

  const handlePresetClick = (val: number) => {
    setContextInput(val)
    onChangeChatSettings({
      ...chatSettings,
      contextLength: val
    })
  }

  return (
    <div className="mt-5">
      <div className="text-muted-foreground mb-2 text-xs" aria-live="polite">
        {modelSummary}
      </div>
      <div className="space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Temperature:</div>
          <div>{chatSettings.temperature}</div>
        </Label>
        <Slider
          value={[chatSettings.temperature]}
          onValueChange={temperature => {
            onChangeChatSettings({
              ...chatSettings,
              temperature: temperature[0]
            })
          }}
          min={MODEL_LIMITS.MIN_TEMPERATURE}
          max={MODEL_LIMITS.MAX_TEMPERATURE}
          step={0.01}
          aria-label="Temperature"
        />
      </div>
      <div className="mt-6 space-y-3">
        <Label className="flex items-center space-x-1">
          <div>Context Length:</div>
          <div>{chatSettings.contextLength}</div>
        </Label>
        <div className="mb-2 flex flex-wrap gap-2">
          {presetContextLengths.map(preset => (
            <button
              key={preset}
              type="button"
              className={`focus:ring-ring rounded border px-2 py-1 text-xs transition-colors focus:outline-none focus:ring-2 ${contextInput === preset ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
              onClick={() => handlePresetClick(preset)}
              aria-label={`Set context length to ${preset}`}
            >
              {preset}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <Slider
            value={[chatSettings.contextLength]}
            onValueChange={contextLength => {
              setContextInput(contextLength[0])
              onChangeChatSettings({
                ...chatSettings,
                contextLength: contextLength[0]
              })
            }}
            min={0}
            max={
              isCustomModel
                ? models.find(model => model.model_id === chatSettings.model)
                    ?.context_length
                : MODEL_LIMITS.MAX_CONTEXT_LENGTH
            }
            step={1}
            aria-label="Context Length"
          />
          <input
            type="number"
            className="border-input bg-background w-24 rounded border px-2 py-1 text-right"
            min={0}
            max={
              isCustomModel
                ? models.find(model => model.model_id === chatSettings.model)
                    ?.context_length
                : MODEL_LIMITS.MAX_CONTEXT_LENGTH
            }
            value={contextInput}
            onChange={e => handleContextInputChange(e.target.value)}
            onBlur={handleContextInputBlur}
            onKeyDown={handleContextInputKeyDown}
            aria-label="Context Length Input"
          />
        </div>
        <div className="text-muted-foreground mt-1 text-xs">
          Max:{" "}
          {isCustomModel
            ? models.find(model => model.model_id === chatSettings.model)
                ?.context_length || MODEL_LIMITS.MAX_CONTEXT_LENGTH
            : MODEL_LIMITS.MAX_CONTEXT_LENGTH}{" "}
          | Output: {MODEL_LIMITS.MAX_TOKEN_OUTPUT_LENGTH}
        </div>
        {inputError && (
          <div
            className="mt-2 flex items-center space-x-2 text-sm text-red-500"
            aria-live="assertive"
          >
            <IconAlertTriangle size={18} />
            <span>{inputError}</span>
          </div>
        )}
        {showClampMessage && (
          <div
            className="mt-2 flex items-center space-x-2 text-sm text-yellow-500"
            aria-live="polite"
          >
            <IconAlertTriangle size={18} />
            <span>
              Value was clamped to the model&apos;s maximum allowed context
              length.
            </span>
          </div>
        )}
        {contextInput >
          (isCustomModel
            ? models.find(model => model.model_id === chatSettings.model)
                ?.context_length || MODEL_LIMITS.MAX_CONTEXT_LENGTH
            : MODEL_LIMITS.MAX_CONTEXT_LENGTH) && (
          <div
            className="mt-2 flex items-center space-x-2 text-sm text-yellow-500"
            aria-live="polite"
          >
            <IconAlertTriangle size={18} />
            <span>
              Context length exceeds the model&apos;s maximum (
              {isCustomModel
                ? models.find(model => model.model_id === chatSettings.model)
                    ?.context_length || MODEL_LIMITS.MAX_CONTEXT_LENGTH
                : MODEL_LIMITS.MAX_CONTEXT_LENGTH}
              ). This may cause errors or truncation.
            </span>
          </div>
        )}
      </div>

      <div className="mt-7 flex items-center space-x-2">
        <Checkbox
          checked={chatSettings.includeProfileContext}
          onCheckedChange={(value: boolean) =>
            onChangeChatSettings({
              ...chatSettings,
              includeProfileContext: value
            })
          }
        />

        <Label>Chats Include Profile Context</Label>

        {showTooltip && (
          <WithTooltip
            delayDuration={0}
            display={
              <div className="w-[400px] p-3">
                {profile?.profile_context || "No profile context."}
              </div>
            }
            trigger={
              <IconInfoCircle className="cursor-hover:opacity-50" size={16} />
            }
          />
        )}
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          checked={chatSettings.includeWorkspaceInstructions}
          onCheckedChange={(value: boolean) =>
            onChangeChatSettings({
              ...chatSettings,
              includeWorkspaceInstructions: value
            })
          }
        />

        <Label>Chats Include Workspace Instructions</Label>

        {showTooltip && (
          <WithTooltip
            delayDuration={0}
            display={
              <div className="w-[400px] p-3">
                {selectedWorkspace?.instructions ||
                  "No workspace instructions."}
              </div>
            }
            trigger={
              <IconInfoCircle className="cursor-hover:opacity-50" size={16} />
            }
          />
        )}
      </div>

      <div className="mt-5">
        <Label>Embeddings Provider</Label>

        <Select
          value={chatSettings.embeddingsProvider}
          onValueChange={(embeddingsProvider: "openai" | "local") => {
            onChangeChatSettings({
              ...chatSettings,
              embeddingsProvider
            })
          }}
        >
          <SelectTrigger>
            <SelectValue defaultValue="openai" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="openai">
              {profile?.use_azure_openai ? "Azure OpenAI" : "OpenAI"}
            </SelectItem>

            {window.location.hostname === "localhost" && (
              <SelectItem value="local">Local</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
