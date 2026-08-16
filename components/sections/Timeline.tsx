"use client"

import * as React from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { color, space, font, radius, shadow } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { SectionHeading } from "../ui/SectionHeading"
import { CornerBrackets } from "../ui/CornerBrackets"

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

// The pulse position and every node's flash are all derived from this one
// shared progress value (0→1, looping) instead of independent animate()
// loops — independent loops each carry their own internal clock, and that
// clock restarts whenever a loop's transition target changes (which
// happened here once real measured node positions replaced the initial
// fallback), so the flashes drifted out of sync with the pulse over time.
// Deriving both from one clock makes them synchronized by construction.
const PULSE_DURATION = 7

function NodeFlash({ progress, passT }: { progress: ReturnType<typeof useMotionValue<number>>; passT: number }) {
  const rampIn = 0.012
  const rampOut = 0.035

  const opacity = useTransform(progress, (v) => {
    // Loop wraps 1→0, so also check the wrapped distance for nodes near
    // either end of the line — otherwise the first/last node's window gets
    // clipped right at the seam instead of the pulse re-approaching it.
    const direct = v - passT
    const wrapped = direct > 0 ? direct - 1 : direct + 1
    const d = Math.abs(direct) <= Math.abs(wrapped) ? direct : wrapped

    if (d <= 0 && d >= -rampIn) return 1 + d / rampIn
    if (d > 0 && d <= rampOut) return 1 - d / rampOut
    return 0
  })

  return (
    <motion.span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: -4,
        borderRadius: "50%",
        backgroundColor: color.accentViolet,
        boxShadow: `0 0 10px 3px ${color.accentViolet}CC, 0 0 20px 8px ${color.accentViolet}66`,
        pointerEvents: "none",
        opacity,
      }}
    />
  )
}

export function Timeline({ heading, subheading, entries }: TimelineProps) {
  const lineRef = React.useRef<HTMLDivElement>(null)
  const nodeRefs = React.useRef<(HTMLSpanElement | null)[]>([])
  // Real measured position of each node's center along the connector line,
  // as a 0–1 fraction of the line's actual rendered height — entries have
  // uneven heights (varying description length, optional asset lists), so
  // assuming even spacing would light nodes up before or after the pulse
  // is actually passing under them.
  const [nodeFractions, setNodeFractions] = React.useState<number[]>([])

  const progress = useMotionValue(0)
  const pulseTop = useTransform(progress, (v) => `${v * 100}%`)

  React.useEffect(() => {
    const controls = animate(progress, 1, {
      duration: PULSE_DURATION,
      repeat: Infinity,
      ease: "linear",
    })
    return () => controls.stop()
  }, [progress])

  React.useEffect(() => {
    function measure() {
      const line = lineRef.current
      if (!line) return
      const lineRect = line.getBoundingClientRect()
      if (lineRect.height === 0) return
      const fractions = nodeRefs.current.map((el) => {
        if (!el) return 0
        const elRect = el.getBoundingClientRect()
        const center = elRect.top + elRect.height / 2 - lineRect.top
        return Math.min(1, Math.max(0, center / lineRect.height))
      })
      setNodeFractions(fractions)
    }

    measure()
    // Re-measure shortly after mount too — web font swap can reflow text
    // height right after the initial paint this effect ran on.
    const settleTimer = setTimeout(measure, 400)
    window.addEventListener("resize", measure)
    return () => {
      clearTimeout(settleTimer)
      window.removeEventListener("resize", measure)
    }
  }, [entries.length])

  return (
    <section
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: `${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      <SectionHeading heading={heading} subheading={subheading} index="02" accent={color.accentViolet} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -80px 0px" }}
        variants={staggerContainer}
        style={{ position: "relative" }}
      >
        <div
          ref={lineRef}
          style={{
            position: "absolute",
            left: 5,
            top: 8,
            bottom: 8,
            width: 1,
            overflow: "visible",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(180deg, ${color.borderStrong}, ${color.border})`,
            }}
          />
          <motion.span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: pulseTop,
              width: 5,
              height: 5,
              marginLeft: -2,
              borderRadius: "50%",
              backgroundColor: color.accentViolet,
              boxShadow: `0 0 10px 2px ${color.accentViolet}80`,
            }}
          />
        </div>

        {entries.map((entry, index) => {
          const dotColor = entry.live || entry.highlight ? color.accentViolet : undefined
          const haloRgb = "185, 174, 221"
          const haloStrength = entry.live || entry.highlight ? 1 : 0.4
          const fallbackT = entries.length > 1 ? index / (entries.length - 1) : 0
          const passT = nodeFractions[index] ?? fallbackT

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
                ref={(el) => {
                  nodeRefs.current[index] = el
                }}
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
                  boxShadow: `0 0 0 4px rgba(${haloRgb}, ${0.12 * haloStrength}), 0 0 12px 1px rgba(${haloRgb}, ${
                    0.5 * haloStrength
                  })`,
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
                        border: `1px solid ${color.accentViolet}`,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        inset: 3,
                        borderRadius: "50%",
                        backgroundColor: color.accentViolet,
                      }}
                    />
                  </>
                ) : null}

                {/* Lights up exactly when the traveling pulse reaches this
                    node — driven from the same shared clock as the pulse
                    itself, so it can't drift out of sync. */}
                <NodeFlash progress={progress} passT={passT} />
              </span>
            </div>

            <div
              style={{
                position: "relative",
                flex: "1 1 auto",
                ...glassSurface(),
                ...(entry.highlight ? { borderColor: color.borderStrong } : {}),
                borderRadius: radius.sm,
                padding: space.md,
              }}
            >
              {entry.highlight ? <CornerBrackets corners={["tr"]} /> : null}

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
                    color: color.textFaint,
                    fontSize: font.size.xs,
                  }}
                >
                  {String(index + 1).padStart(2, "0")}/{String(entries.length).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontFamily: font.mono,
                    color: color.accentViolet,
                    fontSize: font.size.sm,
                    fontWeight: font.weight.semibold,
                  }}
                >
                  {entry.year}
                </span>
                {entry.tag ? (
                  <span
                    style={{
                      fontFamily: font.mono,
                      color: color.textFaint,
                      fontSize: font.size.xs,
                      fontWeight: font.weight.semibold,
                      letterSpacing: font.tracking.label,
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
                  letterSpacing: font.tracking.heading,
                  textTransform: "uppercase",
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
