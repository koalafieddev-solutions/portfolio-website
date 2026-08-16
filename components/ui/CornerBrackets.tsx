import * as React from "react"
import { color } from "../../lib/theme"

export interface CornerBracketsProps {
  corners?: Array<"tr" | "br" | "bl">
  tint?: string
}

const classByCorner: Record<"tr" | "br" | "bl", string> = {
  tr: "corner-mark corner-mark-tr",
  br: "corner-mark corner-mark-br",
  bl: "corner-mark corner-mark-bl",
}

export function CornerBrackets({ corners = ["tr", "bl"], tint = color.borderStrong }: CornerBracketsProps) {
  return (
    <>
      {corners.map((corner) => (
        <span key={corner} className={classByCorner[corner]} style={{ color: tint }} aria-hidden="true" />
      ))}
    </>
  )
}
