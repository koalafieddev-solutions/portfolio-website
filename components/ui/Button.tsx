"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, radius, space, font } from "../../lib/theme"
import { springSnappy } from "../../lib/animations"
import { floatingSurface } from "../../lib/glass"

export interface ButtonProps {
  label: string
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  fullWidth?: boolean
  onTap?: () => void
  className?: string
}

const variantFill: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: { backgroundColor: color.text, color: color.accentText, border: `1px solid ${color.text}` },
  secondary: { backgroundColor: color.glass, color: color.text, border: `1px solid ${color.borderStrong}` },
  ghost: { backgroundColor: "transparent", color: color.textMuted, border: `1px solid transparent` },
}

// A floating control gets its shadow entirely from these variants (never a
// static boxShadow in `style`) — mixing a static and an animated value on
// the same property is what produces a visible jump on first hover.
// The inset lines are the "thin piece of illuminated glass" cue (bright
// top edge, dark bottom edge); the outer shadow is what makes it read as
// a few millimeters above the panel beneath it, and grows/gains a faint
// cyan bleed on hover rather than just darkening.
const insetEdge = "inset 0 1px 0 rgba(255, 255, 255, 0.16), inset 0 -1px 0 rgba(0, 0, 0, 0.3)"

const liftVariants = {
  rest: { y: 0, boxShadow: `${insetEdge}, 0 6px 16px -8px rgba(0, 0, 0, 0.45)` },
  hover: {
    y: -2,
    boxShadow: `${insetEdge}, 0 16px 32px -10px rgba(0, 0, 0, 0.55), 0 0 26px -6px rgba(143, 216, 255, 0.2)`,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  tap: {
    y: 1,
    boxShadow: `${insetEdge}, 0 4px 10px -4px rgba(0, 0, 0, 0.4)`,
    transition: { duration: 0.12, ease: [0.4, 0, 1, 1] },
  },
}

const ghostVariants = {
  rest: { y: 0, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
  hover: { y: -1, boxShadow: "0 0 0 0 rgba(0,0,0,0)", transition: { duration: 0.18 } },
  tap: { y: 0, transition: { duration: 0.1 } },
}

export function Button({ label, href, variant = "primary", fullWidth = false, onTap, className }: ButtonProps) {
  const isGhost = variant === "ghost"
  const floating = isGhost ? {} : floatingSurface()

  const style: React.CSSProperties = {
    ...variantFill[variant],
    ...floating,
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxs,
    width: fullWidth ? "100%" : "auto",
    padding: `${space.xs + 2}px ${space.md}px`,
    borderRadius: radius.sm,
    fontFamily: font.mono,
    fontSize: font.size.xs,
    fontWeight: font.weight.semibold,
    letterSpacing: 1,
    textTransform: "uppercase",
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
  }

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      href={href}
      onClick={onTap}
      className={className}
      style={style}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      animate="rest"
      variants={isGhost ? ghostVariants : liftVariants}
    >
      {variant === "primary" ? (
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            backgroundColor: color.accentText,
            opacity: 0.55,
            flexShrink: 0,
            position: "relative",
            zIndex: 1,
          }}
        />
      ) : null}
      <motion.span
        variants={{ rest: { x: 0 }, hover: { x: -3 } }}
        transition={springSnappy}
        style={{ position: "relative", zIndex: 1 }}
      >
        {label}
      </motion.span>
      <motion.span
        aria-hidden="true"
        variants={{ rest: { x: 0, opacity: 0.85 }, hover: { x: 3, opacity: 1 } }}
        transition={springSnappy}
        style={{ position: "relative", zIndex: 1, display: "inline-flex", fontSize: font.size.md, lineHeight: 1 }}
      >
        →
      </motion.span>
    </Tag>
  )
}
