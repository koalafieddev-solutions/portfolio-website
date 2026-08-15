"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font, radius, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { StatTile } from "../ui/StatTile"

export interface StatsBarItem {
  value: string
  label: string
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
        className="glass-glow-border"
        style={{
          position: "relative",
          ...glassSurface(true),
          borderRadius: radius.lg,
        }}
      >
        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            alignItems: "center",
            gap: space.xs,
            padding: `${space.sm}px ${space.md}px`,
            borderBottom: `1px solid ${color.border}`,
            color: color.textFaint,
            fontSize: font.size.xs,
            fontWeight: font.weight.semibold,
            letterSpacing: 1.2,
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color.accent }} />
          {kicker}
        </motion.div>

        <motion.div variants={fadeUp} className="stats-grid">
          {items.map((stat, index) => (
            <StatTile
              key={stat.label}
              value={stat.value}
              label={stat.label}
              accent={index % 2 === 0 ? "blue" : "amber"}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
