"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, radius, space, font } from "../../lib/theme"
import { springSnappy } from "../../lib/animations"

export interface ButtonProps {
  label: string
  href?: string
  variant?: "primary" | "secondary" | "ghost"
  fullWidth?: boolean
  onTap?: () => void
  className?: string
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: {
    backgroundColor: color.text,
    color: color.accentText,
    border: `1px solid ${color.text}`,
  },
  secondary: {
    backgroundColor: "transparent",
    color: color.text,
    border: `1px solid ${color.borderStrong}`,
  },
  ghost: {
    backgroundColor: "transparent",
    color: color.textMuted,
    border: `1px solid transparent`,
  },
}

export function Button({ label, href, variant = "primary", fullWidth = false, onTap, className }: ButtonProps) {
  const style: React.CSSProperties = {
    ...variantStyles[variant],
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxs,
    width: fullWidth ? "100%" : "auto",
    padding: `${space.xs + 2}px ${space.md}px`,
    borderRadius: radius.sm,
    fontFamily: font.family,
    fontSize: font.size.sm,
    fontWeight: font.weight.semibold,
    letterSpacing: 0.2,
    cursor: "pointer",
    textDecoration: "none",
    whiteSpace: "nowrap",
    // No overflow:hidden — it would clip this element's own hover-glow
    // box-shadow, and nothing here actually needs the clipping.
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
      whileTap={{ scale: 0.97 }}
      animate="rest"
      variants={{
        rest: { boxShadow: "0 0 0 0 rgba(74, 151, 245, 0)" },
        hover: { boxShadow: "0 0 0 1px rgba(74, 151, 245, 0.4), 0 4px 24px rgba(74, 151, 245, 0.3)" },
      }}
      transition={springSnappy}
    >
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
