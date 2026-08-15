/**
 * Shared Framer Motion transitions and variants. Reuse these across
 * components instead of redefining ad-hoc timing per-component.
 *
 * Motion language: fast, precise, physical. Springs over easing curves,
 * short travel distances, no floaty/decorative movement.
 */
import type { Transition, Variants } from "framer-motion"
import { shadow } from "./theme"

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 32,
  mass: 0.7,
}

export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSoft,
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
      staggerChildren: 0.08,
      delayChildren: 0.03,
    },
  },
}

export const hoverLift = {
  rest: { y: 0, scale: 1, boxShadow: shadow.md },
  hover: {
    y: -4,
    scale: 1.008,
    boxShadow: shadow.lg,
    transition: springSnappy,
  },
}
