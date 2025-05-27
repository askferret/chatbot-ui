/**
 * Defines the possible output types for a tool or special message content.
 * This determines how the message content will be rendered in the UI.
 */
export type ToolOutputType =
  | "markdown" // Default, rich text with markdown formatting
  | "svg" // SVG image/diagram, to be rendered inline
  | "chart" // Data to be rendered as a chart (e.g., using a library)
  | "widget" // A custom interactive UI widget
  | "text" // Plain text, no markdown processing
  | "error" // An error message, typically from a failed tool, to be displayed prominently
