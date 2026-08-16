"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font } from "../../lib/theme"
import { springSnappy } from "../../lib/animations"
import { CountUp } from "./CountUp"

export interface StatTileProps {
  value: string
  label: string
  accent?: string
}

export function StatTile({ value, label, accent = color.accentCyan }: StatTileProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        padding: `${space.lg}px ${space.sm}px`,
      }}
    >
      <motion.span
        variants={{ rest: { width: 16, opacity: 0.7 }, hover: { width: 28, opacity: 1 } }}
        transition={springSnappy}
        style={{
          display: "inline-block",
          height: 1,
          backgroundColor: accent,
          marginBottom: space.sm,
        }}
      />
      <motion.div
        variants={{ rest: { y: 0 }, hover: { y: -2 } }}
        transition={springSnappy}
        style={{
          fontFamily: font.mono,
          color: accent,
          fontSize: "clamp(2.1rem, 3.8vw, 2.7rem)",
          fontWeight: font.weight.semibold,
          letterSpacing: -0.5,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          textShadow: `0 0 24px ${accent}33`,
        }}
      >
        <CountUp value={value} />
      </motion.div>
      <div
        style={{
          color: color.textMuted,
          fontFamily: font.mono,
          fontSize: font.size.xs,
          fontWeight: font.weight.medium,
          letterSpacing: font.tracking.label,
          textTransform: "uppercase",
          marginTop: space.sm,
          maxWidth: 170,
          lineHeight: 1.5,
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}
