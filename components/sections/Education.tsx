"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font, radius, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { SectionHeading } from "../ui/SectionHeading"

export interface EducationCourseworkGroup {
  category: string
  courses: string[]
}

export interface EducationData {
  institution: string
  campus: string
  degree: string
  specialization: string
  period: string
  conferDate: string
  valueProposition: string[]
  courseworkGroups: EducationCourseworkGroup[]
}

export interface EducationProps {
  heading: string
  subheading?: string
  data: EducationData
}

export function Education({ heading, subheading, data }: EducationProps) {
  return (
    <section
      style={{
        maxWidth: layout.maxWidth,
        margin: "0 auto",
        padding: `${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      <SectionHeading heading={heading} subheading={subheading} index="03" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeUp}
          style={{
            position: "relative",
            ...glassSurface(true),
            borderTop: `2px solid ${color.accent}`,
            borderRadius: radius.lg,
            padding: space.lg,
            marginBottom: space.lg,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: space.xs,
              marginBottom: space.xs,
            }}
          >
            <span
              style={{
                color: color.accentHover,
                fontSize: font.size.xs,
                fontWeight: font.weight.semibold,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {data.specialization}
            </span>
            <span style={{ color: color.textFaint, fontSize: font.size.xs }}>·</span>
            <span
              style={{
                fontFamily: font.mono,
                color: color.textFaint,
                fontSize: font.size.xs,
              }}
            >
              conferred {data.conferDate}
            </span>
          </div>

          <h3
            style={{
              margin: 0,
              marginBottom: space.xxs,
              fontFamily: font.display,
              color: color.text,
              fontSize: font.size.xl,
              fontWeight: font.weight.semibold,
              letterSpacing: -0.4,
              lineHeight: 1.15,
            }}
          >
            {data.degree}
          </h3>
          <p style={{ margin: 0, marginBottom: space.md, color: color.textMuted, fontSize: font.size.sm }}>
            {data.institution} — {data.campus} · {data.period}
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: space.sm,
              paddingTop: space.md,
              borderTop: `1px solid ${color.border}`,
            }}
          >
            {data.valueProposition.map((paragraph, index) => (
              <p
                key={index}
                style={{
                  margin: 0,
                  color: color.textMuted,
                  fontSize: font.size.sm,
                  lineHeight: 1.65,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} style={{ marginBottom: space.sm }}>
          <span
            style={{
              color: color.textFaint,
              fontSize: font.size.xs,
              fontWeight: font.weight.semibold,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Where it&rsquo;s grounded
          </span>
        </motion.div>

        <motion.div
          variants={fadeUp}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: space.lg,
          }}
        >
          {data.courseworkGroups.map((group) => (
            <div
              key={group.category}
              style={{
                flex: "1 1 220px",
                borderTop: `1px solid ${color.border}`,
                paddingTop: space.sm,
              }}
            >
              <h4
                style={{
                  margin: 0,
                  marginBottom: space.sm,
                  color: color.text,
                  fontSize: font.size.xs,
                  fontWeight: font.weight.semibold,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {group.category}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: space.xs }}>
                {group.courses.map((course) => (
                  <div
                    key={course}
                    style={{
                      color: color.textMuted,
                      fontSize: font.size.sm,
                      lineHeight: 1.4,
                    }}
                  >
                    {course}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
