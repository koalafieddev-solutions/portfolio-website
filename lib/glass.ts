/**
 * Shared glassmorphism surface style. Use instead of hand-rolling
 * backdrop-filter + translucent background per component.
 */
import type * as React from "react"
import { color } from "./theme"

export function glassSurface(strong = false): React.CSSProperties {
  const outerShadow = strong
    ? "0 24px 56px rgba(0, 0, 0, 0.48), 0 6px 16px rgba(0, 0, 0, 0.32)"
    : "0 14px 36px rgba(0, 0, 0, 0.38), 0 3px 10px rgba(0, 0, 0, 0.26)"

  return {
    backgroundColor: strong ? color.glassStrong : color.glass,
    backdropFilter: "blur(26px) saturate(160%)",
    WebkitBackdropFilter: "blur(26px) saturate(160%)",
    border: `1px solid ${color.glassBorder}`,
    // Inset sheen along the top edge (reads as glass catching light) layered
    // with a real outer drop shadow — that's what actually lifts a panel off
    // the page instead of just tinting it; the sheen alone gave no depth.
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 0 0 1px rgba(255, 255, 255, 0.02), ${outerShadow}`,
  }
}
