"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font, radius, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { SectionHeading } from "../ui/SectionHeading"

export interface ProfileItem {
  value: string
  description?: string
}

export interface ProfileCategory {
  key: string
  command: string
  title: string
  display: "tags" | "detailed" | "checklist"
  items: ProfileItem[]
}

export interface ProfileIdentity {
  command: string
  value: string
}

export interface ProfileProps {
  heading: string
  subheading?: string
  identity: ProfileIdentity
  categories: ProfileCategory[]
}

function CategoryItems({ category }: { category: ProfileCategory }) {
  if (category.display === "tags") {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: space.xs }}>
        {category.items.map((item) => (
          <span
            key={item.value}
            style={{
              padding: `${space.xxs + 1}px ${space.sm}px`,
              borderRadius: radius.pill,
              border: `1px solid ${color.border}`,
              color: color.textMuted,
              fontSize: font.size.xs,
              fontWeight: font.weight.medium,
            }}
          >
            {item.value}
          </span>
        ))}
      </div>
    )
  }

  if (category.display === "detailed") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: space.sm }}>
        {category.items.map((item) => (
          <div key={item.value}>
            <div style={{ color: color.text, fontSize: font.size.sm, fontWeight: font.weight.semibold }}>
              {item.value}
            </div>
            {item.description ? (
              <div style={{ color: color.textMuted, fontSize: font.size.xs, lineHeight: 1.55, marginTop: 2 }}>
                {item.description}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: space.sm }}>
      {category.items.map((item) => (
        <div key={item.value} style={{ display: "flex", alignItems: "flex-start", gap: space.sm }}>
          <span
            style={{
              flexShrink: 0,
              width: 4,
              height: 4,
              borderRadius: "50%",
              backgroundColor: color.accent,
              marginTop: 7,
            }}
          />
          <span style={{ color: color.textMuted, fontSize: font.size.sm, lineHeight: 1.55 }}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export function Profile({ heading, subheading, identity, categories }: ProfileProps) {
  return (
    <section
      style={{
        maxWidth: layout.maxWidth,
        margin: "0 auto",
        padding: `${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      <SectionHeading heading={heading} subheading={subheading} index="01" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeUp}
          style={{
            textAlign: "center",
            marginBottom: space.xl,
          }}
        >
          <div
            style={{
              color: color.text,
              fontFamily: font.display,
              fontSize: font.size.lg,
              fontWeight: font.weight.medium,
              letterSpacing: -0.2,
            }}
          >
            {identity.value}
          </div>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: space.lg,
          }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.key}
              variants={fadeUp}
              style={{
                borderTop: `1px solid ${color.border}`,
                paddingTop: space.md,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: space.sm,
                  color: color.text,
                  fontFamily: font.display,
                  fontSize: font.size.lg,
                  fontWeight: font.weight.semibold,
                  letterSpacing: -0.2,
                }}
              >
                {category.title}
              </h3>

              <CategoryItems category={category} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
