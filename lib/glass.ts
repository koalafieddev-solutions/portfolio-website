/**
 * Shared frosted-glass instrument-panel surface — translucent blurred fill,
 * a bright hairline border, and a soft inset sheen along the top edge so it
 * reads as an actual pane of glass rather than a tinted flat rectangle.
 */
import type * as React from "react"
import { color, elevation } from "./theme"

// strong=true → a Depth-2 primary panel: the largest, most-blurred glass
// plane a section sits on. strong=false → a Depth-3 nested surface (a
// smaller card resting on top of that panel) — less blur than its parent,
// so it visibly reads as physically closer to the viewer than the panel
// beneath it, not just visually "on top" via z-index.
export function glassSurface(strong = false): React.CSSProperties {
  const blur = strong ? elevation.panel : elevation.nested
  const outerShadow = strong
    ? "0 28px 72px rgba(0, 0, 0, 0.52), 0 8px 22px rgba(0, 0, 0, 0.36), 0 0 70px -28px rgba(143, 216, 255, 0.10)"
    : "0 14px 40px rgba(0, 0, 0, 0.4), 0 3px 12px rgba(0, 0, 0, 0.28)"

  return {
    backgroundColor: strong ? color.glassStrong : color.glass,
    // Faint directional light — brighter upper edge fading to a slightly
    // darker lower edge — so the pane reads as a physical sheet of glass
    // catching light from above, not a flat tinted rectangle.
    backgroundImage:
      "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.10) 100%)",
    backdropFilter: `blur(${blur}px) saturate(150%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(150%)`,
    // Longhand border properties, not the `border` shorthand — framer-motion
    // decomposes border into individual motion values for its own
    // interpolation, and mixing the shorthand with a longhand override
    // (e.g. borderColor) on the same animated element trips its "conflicting
    // style property" warning on every rerender.
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color.glassBorder,
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.22), inset 0 0 0 1px rgba(255, 255, 255, 0.02), ${outerShadow}`,
  }
}

// Depth-4 — a small physical control (button, toggle, tab) resting above a
// glass panel. Tighter blur than anything it sits on, plus a shadow tuned
// to look like light bleeding onto the surface underneath rather than a
// flat drop shadow — the cue that sells "floating a few millimeters up."
export function floatingSurface(): React.CSSProperties {
  return {
    backdropFilter: `blur(${elevation.floating}px) saturate(160%)`,
    WebkitBackdropFilter: `blur(${elevation.floating}px) saturate(160%)`,
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(0, 0, 0, 0.3), 0 10px 24px -8px rgba(0, 0, 0, 0.55), 0 2px 8px rgba(0, 0, 0, 0.3)",
  }
}
