import React, { FC } from "react"
import { Tables } from "@/supabase/types"
import { MessageMarkdown } from "./message-markdown"
import { SvgMessage } from "./svg-message"
// import { ChartMessage } from "./chart-message"; // Future: Component to render chart data
// import { WidgetMessage } from "./widget-message"; // Future: Component to render generic widgets

/**
 * Defines the possible output types for a tool or special message content.
 * This determines how the message content will be rendered.
 */
export type ToolOutputType =
  | "markdown" // Default, rich text with markdown formatting
  | "svg" // SVG image/diagram
  | "chart" // Data to be rendered as a chart
  | "widget" // A custom interactive widget
  | "text" // Plain text, no markdown processing
  | "error" // An error message, typically from a failed tool

/**
 * Represents a message object that the MessageContentRenderer can handle.
 * It extends the base message type with fields to control rendering.
 */
export interface RenderableMessage extends Tables<"messages"> {
  /**
   * Specifies how the message content should be rendered.
   * Defaults to "markdown" if not provided.
   */
  toolOutputType?: ToolOutputType
  /**
   * Optional metadata associated with the message content.
   * Used for things like chart configurations, widget data, or error details.
   * @example
   * // For a chart:
   * // meta: { chartType: "bar", data: [...], options: {...} }
   * // For an error:
   * // meta: { errorCode: "API_TIMEOUT", details: "The API did not respond in time." }
   */
  meta?: Record<string, any>
}

interface MessageContentRendererProps {
  /**
   * The message object to render. This object should conform to the
   * RenderableMessage interface, potentially including `toolOutputType`
   * and `meta` fields to guide rendering.
   */
  message: RenderableMessage
}

/**
 * Renders the main content of a chat message based on its `toolOutputType`.
 * This component acts as a central dispatcher, selecting the appropriate
 * sub-component (e.g., MessageMarkdown, SvgMessage) for rendering.
 *
 * It enhances extensibility by allowing new content types to be added easily
 * by implementing a new rendering component and adding a case to the switch.
 *
 * @component
 * @param {MessageContentRendererProps} props - The props for the component.
 * @returns {React.ReactElement} The React element representing the rendered message content.
 *
 * @example
 * // Assuming `chatMessage` is an object conforming to `RenderableMessage`
 * <MessageContentRenderer message={chatMessage} />
 */
export const MessageContentRenderer: FC<MessageContentRendererProps> = ({
  message
}) => {
  // Default to "markdown" if toolOutputType is not specified or is an unknown value.
  const outputType = message.toolOutputType || "markdown"
  console.log(
    "[MessageContentRenderer] Rendering message:",
    JSON.stringify(message, null, 2),
    "Output type:",
    outputType
  )

  switch (outputType) {
    case "svg":
      // Use SvgMessage to render SVG content.
      return <SvgMessage svgContent={message.content} meta={message.meta} />

    case "chart":
      // TODO: Implement ChartMessage component
      console.warn(
        `Chart rendering not yet implemented for message ID: ${message.id}. Displaying metadata and content as raw text.`
      )
      return (
        <div className="message-content-raw message-content-chart-placeholder">
          <p className="font-semibold text-yellow-600 dark:text-yellow-400">
            Chart Data (Preview not available)
          </p>
          {message.meta && (
            <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
              {`Meta: ${JSON.stringify(message.meta, null, 2)}`}
            </pre>
          )}
          <pre className="mt-1 whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
            {`Content: ${message.content}`}
          </pre>
        </div>
      )

    case "widget":
      // TODO: Implement WidgetMessage component
      console.warn(
        `Widget rendering not yet implemented for message ID: ${message.id}. Displaying metadata and content as raw text.`
      )
      return (
        <div className="message-content-raw message-content-widget-placeholder">
          <p className="font-semibold text-yellow-600 dark:text-yellow-400">
            Widget Data (Preview not available)
          </p>
          {message.meta && (
            <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
              {`Meta: ${JSON.stringify(message.meta, null, 2)}`}
            </pre>
          )}
          <pre className="mt-1 whitespace-pre-wrap break-all rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
            {`Content: ${message.content}`}
          </pre>
        </div>
      )

    case "text":
      // Renders content as plain text, without markdown processing.
      // Useful for tool outputs that are explicitly non-markdown.
      return (
        <p className="message-content-text whitespace-pre-wrap break-words">
          {message.content}
        </p>
      )

    case "error":
      // Renders an error message, typically from a failed tool execution.
      // The `message.content` should contain the primary error message.
      // `message.meta.details` can contain additional stack trace or technical info.
      return (
        <div
          className="message-content-error rounded border border-red-500 bg-red-50 p-3 text-red-700 dark:border-red-700 dark:bg-red-900/30 dark:text-red-400"
          role="alert"
        >
          <p className="font-semibold">Tool Execution Error:</p>
          <p className="mt-1 whitespace-pre-wrap break-words">
            {message.content}
          </p>
          {message.meta?.details && (
            <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-red-100 p-2 text-xs text-red-600 dark:bg-red-800/30 dark:text-red-300">
              {typeof message.meta.details === "string"
                ? message.meta.details
                : JSON.stringify(message.meta.details, null, 2)}
            </pre>
          )}
        </div>
      )

    case "markdown":
    default:
      // Default rendering behavior using the existing MessageMarkdown component.
      // This handles standard text, markdown formatting, code blocks, and inline images.
      return <MessageMarkdown content={message.content} />
  }
}

MessageContentRenderer.displayName = "MessageContentRenderer"
