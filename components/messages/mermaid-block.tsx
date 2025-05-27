import React, { FC, useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidBlockProps {
  code: string
  /**
   * A unique key for React list rendering, can also be used to help
   * force re-renders if the diagram needs to be explicitly re-run.
   */
  idKey: string
}

const MermaidBlock: FC<MermaidBlockProps> = ({ code, idKey }) => {
  const mermaidDivRef = useRef<HTMLDivElement>(null)
  // Ensure unique ID for each diagram, even if multiple on page
  const [diagramId] = useState(
    () =>
      `mermaid-diagram-${idKey}-${Math.random().toString(36).substring(2, 15)}`
  )
  const [svgOutput, setSvgOutput] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false, // We manually trigger render
      theme: "neutral", // Or 'dark', 'forest', 'default', 'neutral' - or use themeVariables
      // securityLevel: 'strict', // Consider 'strict' or 'antiscript' if concerned about XSS from mermaid code
      fontFamily: '"trebuchet ms", verdana, arial, sans-serif'
    })

    const renderMermaid = async () => {
      try {
        if (code && mermaidDivRef.current) {
          // mermaid.render() returns the SVG code and an optional bindFunctions callback
          const { svg } = await mermaid.render(diagramId, code)
          setSvgOutput(svg)
          setError(null)
          // The div itself will be used if we don't manually insert.
          // If we want to render into a specific div not managed by mermaid's internal ID system:
          // if (mermaidDivRef.current) {
          //  mermaidDivRef.current.innerHTML = svg;
          // }
        }
      } catch (e: any) {
        console.error("Mermaid rendering error:", e)
        setError(e.message || "Failed to render Mermaid diagram.")
        setSvgOutput(null)
      }
    }

    renderMermaid()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, diagramId]) // Rerun when code or the generated diagramId changes. idKey change will also trigger re-render due to parent.

  if (error) {
    return (
      <div className="rounded border border-red-500 bg-red-50 p-2">
        <p className="font-semibold text-red-700">Mermaid Diagram Error:</p>
        <pre className="whitespace-pre-wrap text-xs text-red-600">{error}</pre>
        <p className="mt-2 text-xs text-gray-500">Original Code:</p>
        <pre className="whitespace-pre-wrap rounded bg-gray-100 p-1 text-xs">
          {code}
        </pre>
      </div>
    )
  }

  // Render the div that mermaid will target if svgOutput is not yet ready,
  // or directly render the SVG string if available.
  // Using dangerouslySetInnerHTML is generally how mermaid output is displayed.
  return svgOutput ? (
    <div
      className="mermaid-container w-full overflow-auto"
      dangerouslySetInnerHTML={{ __html: svgOutput }}
    />
  ) : (
    <div
      ref={mermaidDivRef}
      id={diagramId}
      className="mermaid-placeholder min-h-[100px] w-full"
    >
      {code}
    </div>
  )
}

export default MermaidBlock
