"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font, radius, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { use3DTilt } from "../../lib/use3DTilt"
import { SectionHeading } from "../ui/SectionHeading"
import { CornerBrackets } from "../ui/CornerBrackets"

export interface EducationCourseworkGroup {
  category: string
  courses: string[]
}

function CourseworkCard({ group }: { group: EducationCourseworkGroup }) {
  const tilt = use3DTilt(4)

  return (
    <motion.div
      {...tilt.handlers}
      style={{
        position: "relative",
        flex: "1 1 220px",
        ...glassSurface(),
        borderRadius: radius.sm,
        padding: space.md,
        transformPerspective: tilt.transformPerspective,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
    >
      <CornerBrackets corners={["tr"]} />

      <h4
        style={{
          margin: 0,
          marginBottom: space.sm,
          color: color.accentMint,
          fontFamily: font.mono,
          fontSize: font.size.xs,
          fontWeight: font.weight.semibold,
          textTransform: "uppercase",
          letterSpacing: font.tracking.label,
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
    </motion.div>
  )
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
  const mainTilt = use3DTilt(3)

  return (
    <section
      style={{
        maxWidth: layout.maxWidth,
        margin: "0 auto",
        padding: `${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      <SectionHeading heading={heading} subheading={subheading} index="03" accent={color.accentMint} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeUp}
          {...mainTilt.handlers}
          style={{
            position: "relative",
            ...glassSurface(true),
            borderRadius: radius.sm,
            padding: space.lg,
            marginBottom: space.lg,
            transformPerspective: mainTilt.transformPerspective,
            rotateX: mainTilt.rotateX,
            rotateY: mainTilt.rotateY,
          }}
        >
          <CornerBrackets corners={["tr", "bl"]} />

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
                fontFamily: font.mono,
                color: color.accentMint,
                fontSize: font.size.xs,
                fontWeight: font.weight.semibold,
                letterSpacing: font.tracking.label,
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
              letterSpacing: font.tracking.heading,
              lineHeight: 1.15,
              textTransform: "uppercase",
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
              fontFamily: font.mono,
              fontSize: font.size.xs,
              fontWeight: font.weight.semibold,
              textTransform: "uppercase",
              letterSpacing: font.tracking.label,
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
            <CourseworkCard key={group.category} group={group} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
