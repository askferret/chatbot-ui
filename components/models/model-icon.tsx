import { cn } from "@/lib/utils"
import mistral from "@/public/providers/mistral.png"
import groq from "@/public/providers/groq.png"
import perplexity from "@/public/providers/perplexity.png"
import { ModelProvider } from "@/types"
import { IconSparkles } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { FC, HTMLAttributes, forwardRef } from "react"
import { AnthropicSVG } from "../icons/anthropic-svg"
import { GoogleSVG } from "../icons/google-svg"
import { OpenAISVG } from "../icons/openai-svg"

interface ModelIconProps extends HTMLAttributes<HTMLDivElement> {
  provider: ModelProvider
  height: number
  width: number
}

/**
 * ModelIcon renders the provider's icon or logo, supporting refs for Radix UI compatibility.
 * @param {ModelIconProps} props - The props for the icon.
 * @param {React.Ref<HTMLDivElement>} ref - The forwarded ref.
 */
export const ModelIcon = forwardRef<HTMLDivElement, ModelIconProps>(
  ({ provider, height, width, ...props }, ref) => {
    const { theme } = useTheme()

    switch (provider as ModelProvider) {
      case "openai":
        return (
          <span ref={ref} style={{ display: "inline-block", height, width }}>
            <OpenAISVG
              className={cn(
                "rounded-sm bg-white p-1 text-black",
                props.className,
                theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
              )}
              width={width}
              height={height}
            />
          </span>
        )
      case "mistral":
        return (
          <span ref={ref} style={{ display: "inline-block", height, width }}>
            <Image
              className={cn(
                "rounded-sm p-1",
                theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
              )}
              src={mistral.src}
              alt="Mistral"
              width={width}
              height={height}
            />
          </span>
        )
      case "groq":
        return (
          <span ref={ref} style={{ display: "inline-block", height, width }}>
            <Image
              className={cn(
                "rounded-sm p-0",
                theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
              )}
              src={groq.src}
              alt="Groq"
              width={width}
              height={height}
            />
          </span>
        )
      case "anthropic":
        return (
          <span ref={ref} style={{ display: "inline-block", height, width }}>
            <AnthropicSVG
              className={cn(
                "rounded-sm bg-white p-1 text-black",
                props.className,
                theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
              )}
              width={width}
              height={height}
            />
          </span>
        )
      case "google":
        return (
          <span ref={ref} style={{ display: "inline-block", height, width }}>
            <GoogleSVG
              className={cn(
                "rounded-sm bg-white p-1 text-black",
                props.className,
                theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
              )}
              width={width}
              height={height}
            />
          </span>
        )
      case "perplexity":
        return (
          <span ref={ref} style={{ display: "inline-block", height, width }}>
            <Image
              className={cn(
                "rounded-sm p-1",
                theme === "dark" ? "bg-white" : "border-DEFAULT border-black"
              )}
              src={perplexity.src}
              alt="Mistral"
              width={width}
              height={height}
            />
          </span>
        )
      default:
        return (
          <span ref={ref}>
            <IconSparkles size={width} />
          </span>
        )
    }
  }
)

ModelIcon.displayName = "ModelIcon"
