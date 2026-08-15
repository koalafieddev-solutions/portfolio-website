"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font } from "../../lib/theme"
import { springSnappy } from "../../lib/animations"
import { CountUp } from "./CountUp"

export interface StatTileProps {
  value: string
  label: string
  accent?: "blue" | "amber"
}

export function StatTile({ value, label, accent = "blue" }: StatTileProps) {
  const accentColor = accent === "amber" ? color.signal : color.accent
  const glowRgb = accent === "amber" ? "232, 169, 79" : "91, 159, 232"

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
        variants={{ rest: { width: 20, opacity: 0.9 }, hover: { width: 32, opacity: 1 } }}
        transition={springSnappy}
        style={{
          display: "inline-block",
          height: 2,
          borderRadius: 1,
          backgroundColor: accentColor,
          marginBottom: space.sm,
        }}
      />
      <motion.div
        variants={{
          rest: {
            y: 0,
            scale: 1,
            textShadow: `0 0 24px rgba(${glowRgb}, 0.2), 0 0 4px rgba(${glowRgb}, 0.12)`,
          },
          hover: {
            y: -2,
            scale: 1.04,
            textShadow: `0 0 64px rgba(${glowRgb}, 0.75), 0 0 18px rgba(${glowRgb}, 0.55)`,
          },
        }}
        transition={springSnappy}
        style={{
          fontFamily: font.mono,
          color: color.text,
          fontSize: "clamp(2.2rem, 4vw, 2.9rem)",
          fontWeight: font.weight.bold,
          letterSpacing: -1,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <CountUp value={value} />
      </motion.div>
      <div
        style={{
          color: color.textMuted,
          fontSize: font.size.xs,
          fontWeight: font.weight.semibold,
          letterSpacing: 0.6,
          textTransform: "uppercase",
          marginTop: space.sm,
          maxWidth: 160,
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
    </motion.div>
  )
}
