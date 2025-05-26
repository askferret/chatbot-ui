import React, { useRef, useEffect } from "react"

/**
 * Renders an interactive HTML/JS/CSS canvas in a sandboxed iframe.
 * @param {string} htmlSource - The HTML/JS/CSS to render.
 * @param {number} [canvasHeight=500] - Height of the canvas in pixels.
 * @example
 * <InteractiveCanvas htmlSource="<h1>Hello</h1>" canvasHeight={400} />
 */
export const InteractiveCanvas: React.FC<{
  htmlSource: string
  canvasHeight?: number
}> = ({ htmlSource, canvasHeight = 500 }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(htmlSource)
        doc.close()
      }
    }
  }, [htmlSource])

  return (
    <div
      style={{
        width: "100%",
        height: canvasHeight,
        border: "1px solid #eee",
        borderRadius: 8,
        overflow: "hidden",
        background: "#fff"
      }}
    >
      <iframe
        ref={iframeRef}
        title="Interactive Canvas"
        style={{ width: "100%", height: "100%", border: "none" }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}
