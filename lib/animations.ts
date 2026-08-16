/**
 * Shared Framer Motion transitions and variants. Reuse these across
 * components instead of redefining ad-hoc timing per-component.
 *
 * Motion language: fast, precise, physical. Springs over easing curves,
 * short travel distances, no floaty/decorative movement.
 */
import type { Transition, Variants } from "framer-motion"

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 32,
  mass: 0.7,
}

export const springSoft: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 30,
  mass: 0.9,
}

// A slight blur-to-focus resolves alongside the rise + fade — reads as
// something powering on / coming into focus rather than a plain slide,
// without ever being slow enough to feel floaty.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...springSoft, filter: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.04,
    },
  },
}

// Mirrors glassSurface()'s own shadow exactly at rest (inset sheen + the
// same two-layer outer shadow) so there's no visible jump on mount, then
// lifts higher with a deeper shadow on hover — variants fully replace
// boxShadow rather than merge with it, so this has to restate the sheen
// on every keyframe or a hovered card would lose its glass highlight.
export const hoverLift = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 0 0 1px rgba(255, 255, 255, 0.02), 0 14px 36px rgba(0, 0, 0, 0.38), 0 3px 10px rgba(0, 0, 0, 0.26)",
  },
  // Whole card grows as one unit — matched to (not dwarfed by) the inner
  // image's own hover scale, so the panel visibly expands rather than
  // reading as a static frame around a zooming picture.
  hover: {
    y: -8,
    scale: 1.035,
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.03), 0 30px 68px rgba(0, 0, 0, 0.5), 0 8px 22px rgba(0, 0, 0, 0.32)",
    transition: springSnappy,
  },
}
