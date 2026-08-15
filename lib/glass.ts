/**
 * Shared glassmorphism surface style. Use instead of hand-rolling
 * backdrop-filter + translucent background per component.
 */
import type * as React from "react"
import { color } from "./theme"

export function glassSurface(strong = false): React.CSSProperties {
  return {
    backgroundColor: strong ? color.glassStrong : color.glass,
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: `1px solid ${color.glassBorder}`,
  }
}
