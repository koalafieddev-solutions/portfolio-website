"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font, radius, shadow } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { SectionHeading } from "../ui/SectionHeading"

export interface TimelineAsset {
  title: string
  image: string
}

export interface TimelineEntry {
  year: string
  title: string
  description: string
  tag?: string
  highlight?: boolean
  live?: boolean
  assets?: TimelineAsset[]
}

export interface TimelineProps {
  heading: string
  subheading?: string
  entries: TimelineEntry[]
}

export function Timeline({ heading, subheading, entries }: TimelineProps) {
  return (
    <section
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: `${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      <SectionHeading heading={heading} subheading={subheading} index="02" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
        style={{ position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            left: 5,
            top: 8,
            bottom: 8,
            width: 1,
            backgroundColor: color.border,
          }}
        />

        {entries.map((entry, index) => {
          const dotColor = entry.live ? color.accent : entry.highlight ? color.signal : undefined

          return (
          <motion.div
            key={`${entry.year}-${index}`}
            variants={fadeUp}
            style={{
              position: "relative",
              display: "flex",
              gap: space.md,
              paddingLeft: 0,
              marginBottom: index === entries.length - 1 ? 0 : space.lg,
            }}
          >
            <div style={{ flex: "0 0 11px", display: "flex", justifyContent: "center", paddingTop: 6 }}>
              <span
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 11,
                  height: 11,
                  borderRadius: "50%",
                  backgroundColor: dotColor ?? color.background,
                  border: `1px solid ${dotColor ?? color.borderStrong}`,
                  flexShrink: 0,
                }}
              >
                {entry.live ? (
                  <>
                    <span
                      className="signal-ring"
                      style={{
                        position: "absolute",
                        inset: -2,
                        borderRadius: "50%",
                        border: `1px solid ${color.accent}`,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        inset: 3,
                        borderRadius: "50%",
                        backgroundColor: color.accent,
                      }}
                    />
                  </>
                ) : null}
              </span>
            </div>

            <div
              style={{
                flex: "1 1 auto",
                ...(entry.highlight
                  ? {
                      ...glassSurface(),
                      borderColor: entry.live ? "rgba(91, 159, 232, 0.32)" : "rgba(232, 169, 79, 0.32)",
                    }
                  : { border: "none" }),
                borderRadius: entry.highlight ? radius.md : 0,
                padding: entry.highlight ? space.md : 0,
                paddingBottom: entry.highlight ? space.md : space.xs,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: space.xs,
                  marginBottom: space.xxs,
                }}
              >
                <span
                  style={{
                    fontFamily: font.mono,
                    color: entry.live ? color.accentHover : entry.highlight ? color.signalHover : color.accentHover,
                    fontSize: font.size.sm,
                    fontWeight: font.weight.semibold,
                  }}
                >
                  {entry.year}
                </span>
                {entry.tag ? (
                  <span
                    style={{
                      color: color.textFaint,
                      fontSize: font.size.xs,
                      fontWeight: font.weight.semibold,
                      letterSpacing: 0.5,
                      textTransform: "uppercase",
                    }}
                  >
                    {entry.tag}
                  </span>
                ) : null}
              </div>

              <h3
                style={{
                  margin: 0,
                  marginBottom: space.xxs,
                  fontFamily: font.display,
                  color: color.text,
                  fontSize: font.size.lg,
                  fontWeight: font.weight.semibold,
                  letterSpacing: -0.2,
                }}
              >
                {entry.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: color.textMuted,
                  fontSize: font.size.sm,
                  lineHeight: 1.6,
                }}
              >
                {entry.description}
              </p>

              {entry.assets && entry.assets.length > 0 ? (
                <div
                  style={{
                    marginTop: space.md,
                    paddingTop: space.md,
                    borderTop: `1px solid ${color.border}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: space.sm,
                  }}
                >
                  {entry.assets.map((asset) => (
                    <div
                      key={asset.title}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: space.sm,
                      }}
                    >
                      <span
                        style={{
                          width: 96,
                          height: 54,
                          borderRadius: radius.md,
                          backgroundImage: `url(${asset.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          border: `1px solid ${color.border}`,
                          boxShadow: shadow.sm,
                          flexShrink: 0,
                        }}
                        role="img"
                        aria-label={asset.title}
                      />
                      <span
                        style={{
                          color: color.textMuted,
                          fontSize: font.size.sm,
                          lineHeight: 1.4,
                        }}
                      >
                        {asset.title}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
