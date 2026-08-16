"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font, radius, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { CornerBrackets } from "../ui/CornerBrackets"
import { StatTile } from "../ui/StatTile"

export interface StatsBarItem {
  value: string
  label: string
  accent?: string
}

export interface StatsBarProps {
  kicker: string
  items: StatsBarItem[]
}

export function StatsBar({ kicker, items }: StatsBarProps) {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 2,
        maxWidth: layout.maxWidth,
        margin: "-40px auto 0",
        padding: `0 ${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2, margin: "0px 0px -80px 0px" }}
        variants={staggerContainer}
        style={{
          position: "relative",
          ...glassSurface(true),
          borderRadius: radius.sm,
        }}
      >
        <CornerBrackets corners={["tr", "bl"]} />

        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            gap: space.xs,
            padding: `${space.sm}px ${space.md}px`,
            borderBottom: `1px solid ${color.border}`,
            color: color.textFaint,
            fontFamily: font.mono,
            fontSize: font.size.xs,
            fontWeight: font.weight.medium,
            letterSpacing: font.tracking.label,
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 5, height: 5, border: `1px solid ${color.textFaint}` }} />
          {kicker}
        </motion.div>

        <motion.div variants={fadeUp} className="stats-grid">
          {items.map((stat) => (
            <StatTile key={stat.label} value={stat.value} label={stat.label} accent={stat.accent} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
