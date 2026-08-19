"use client"

import * as React from "react"
import { AnimatePresence, motion, useMotionValue, useTransform, useReducedMotion, animate } from "framer-motion"
import { color, space, font, radius, shadow, ease } from "../../lib/theme"
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
// shared progress value instead of independent animate() loops —
// independent loops each carry their own internal clock, and that clock
// restarts whenever a loop's transition target changes (which happened here
// once real measured node positions replaced the initial fallback), so the
// flashes drifted out of sync with the pulse over time. Deriving both from
// one clock makes them synchronized by construction.
//
// The pulse travels top → the "now" node, holds there with a burst + scale
// pop, then fades, resets, and travels again — rather than looping straight
// through to the bottom of the line.
const TRAVEL_DURATION = 3.2
const HOLD_DURATION = 1.5
const RESET_FADE = 0.55

interface Spark {
  id: number
  angle: number
  distance: number
  size: number
  delay: number
}

const SPARK_COUNT = 6

// Three concentric rings, staggered slightly, radiating out and fading —
// a soft ripple rather than one ring popping out — each on its own
// generous duration so the fade itself never feels rushed.
const RING_BURSTS = [
  { delay: 0, scale: 3.2, opacity: 0.95, width: 2 },
  { delay: 0.14, scale: 4.6, opacity: 0.75, width: 1.5 },
  { delay: 0.28, scale: 6, opacity: 0.55, width: 1.5 },
]

function makeSparks(seed: number): Spark[] {
  return Array.from({ length: SPARK_COUNT }, (_, i) => {
    const spread = (i / SPARK_COUNT) * Math.PI * 2
    return {
      id: seed + i,
      angle: spread + (Math.random() - 0.5) * 0.6,
      distance: 10 + Math.random() * 12,
      size: 2 + Math.random() * 2,
      delay: Math.random() * 0.05,
    }
  })
}

function NodeFlash({
  progress,
  passT,
  fade,
}: {
  progress: ReturnType<typeof useMotionValue<number>>
  passT: number
  fade: ReturnType<typeof useMotionValue<number>>
}) {
  const rampIn = 0.012
  const rampOut = 0.035

  // Multiplied against `fade` (the same value the traveling dot fades
  // through on reset) rather than driven by `progress` alone — otherwise
  // the "now" node sits at full glow through the whole hold, then the
  // instant progress.set(0) reset snaps it straight to 0 with no transition
  // at all, reading as a hard cutoff instead of a fade.
  const opacity = useTransform([progress, fade], ([v, f]: number[]) => {
    // Loop wraps 1→0, so also check the wrapped distance for nodes near
    // either end of the line — otherwise the first/last node's window gets
    // clipped right at the seam instead of the pulse re-approaching it.
    const direct = v - passT
    const wrapped = direct > 0 ? direct - 1 : direct + 1
    const d = Math.abs(direct) <= Math.abs(wrapped) ? direct : wrapped

    let base = 0
    if (d <= 0 && d >= -rampIn) base = 1 + d / rampIn
    else if (d > 0 && d <= rampOut) base = 1 - d / rampOut
    return base * f
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
  const pulseScale = useMotionValue(1)
  const pulseOpacity = useMotionValue(1)
  const [burstKey, setBurstKey] = React.useState(0)
  const [sparks, setSparks] = React.useState<Spark[]>([])
  const sparkSeedRef = React.useRef(0)
  const sparkTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()

  const nowIndex = React.useMemo(() => {
    const i = entries.findIndex((e) => e.live)
    return i === -1 ? entries.length - 1 : i
  }, [entries])

  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    let cancelled = false
    const fallbackT = entries.length > 1 ? nowIndex / (entries.length - 1) : 0
    const targetT = nodeFractions[nowIndex] ?? fallbackT

    // Reduced motion: settle once on the "now" node — its glow stays lit
    // via NodeFlash reading the same `progress`/`pulseOpacity` values —
    // and skip the repeating travel/burst/particle cycle entirely rather
    // than just trimming its extras.
    if (reduceMotion) {
      progress.set(targetT)
      pulseScale.set(1)
      pulseOpacity.set(1)
      return
    }

    async function cycle() {
      while (!cancelled) {
        progress.set(0)
        pulseScale.set(1)
        pulseOpacity.set(1)

        await animate(progress, targetT, { duration: TRAVEL_DURATION, ease: "linear" })
        if (cancelled) return

        // Arrival: a quick expand-and-settle pop on the dot itself, a
        // one-shot ring burst, and a small handful of energy particles
        // flung outward — all fired from the same synced clock moment.
        setBurstKey((k) => k + 1)
        sparkSeedRef.current += SPARK_COUNT
        setSparks(makeSparks(sparkSeedRef.current))
        if (sparkTimeoutRef.current) clearTimeout(sparkTimeoutRef.current)
        sparkTimeoutRef.current = setTimeout(() => setSparks([]), 500)

        await animate(pulseScale, [1, 1.9, 1], { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] })
        if (cancelled) return

        await new Promise((resolve) => setTimeout(resolve, HOLD_DURATION * 1000))
        if (cancelled) return

        await animate(pulseOpacity, 0, { duration: RESET_FADE, ease: "easeInOut" })
        if (cancelled) return
        progress.set(0)
        await animate(pulseOpacity, 1, { duration: RESET_FADE, ease: "easeInOut" })
      }
    }

    cycle()
    return () => {
      cancelled = true
      if (sparkTimeoutRef.current) clearTimeout(sparkTimeoutRef.current)
    }
  }, [progress, pulseScale, pulseOpacity, nodeFractions, nowIndex, entries.length, reduceMotion])

  const measure = React.useCallback(() => {
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
  }, [])

  React.useEffect(() => {
    measure()
    // Re-measure shortly after mount too — web font swap can reflow text
    // height right after the initial paint this effect ran on.
    const settleTimer = setTimeout(measure, 400)
    window.addEventListener("resize", measure)
    return () => {
      clearTimeout(settleTimer)
      window.removeEventListener("resize", measure)
    }
  }, [entries.length, measure])

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
        // Entries measured above land ~18px low until this reveal settles
        // (fadeUp's hidden state is translateY(18px), and getBoundingClientRect
        // picks that transform up) — re-measure once the entrance animation
        // has had time to finish so the pulse's target position is accurate.
        onViewportEnter={() => {
          setTimeout(measure, 1500)
        }}
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
              marginTop: -2.5,
              borderRadius: "50%",
              backgroundColor: color.accentViolet,
              boxShadow: `0 0 10px 2px ${color.accentViolet}80`,
              scale: pulseScale,
              opacity: pulseOpacity,
            }}
          />

          {/* One-shot burst rings — three concentric ripples fired each time
              the pulse arrives at the "now" node, radiating outward and
              fading in a soft, staggered wave, then swapped out (via key)
              rather than looped. */}
          {burstKey > 0 &&
            RING_BURSTS.map((ring, i) => (
              <motion.span
                key={`${burstKey}-${i}`}
                aria-hidden="true"
                initial={{ scale: 0.5, opacity: ring.opacity }}
                animate={{ scale: ring.scale, opacity: 0 }}
                transition={{ duration: 1.1, delay: ring.delay, ease: ease.out }}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: pulseTop,
                  width: 5,
                  height: 5,
                  marginLeft: -2,
                  marginTop: -2.5,
                  borderRadius: "50%",
                  border: `${ring.width}px solid ${color.accentViolet}`,
                  boxShadow: `0 0 8px 1px ${color.accentViolet}99`,
                  pointerEvents: "none",
                }}
              />
            ))}

          {/* Tiny energy-particle spark — a handful of specks flung a short
              distance outward from the dot on arrival and faded, anchored
              at the same centered point as the dot itself. */}
          <motion.div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: pulseTop,
              marginTop: -2.5,
              width: 0,
              height: 0,
              pointerEvents: "none",
            }}
          >
            <AnimatePresence>
              {sparks.map((s) => (
                <motion.span
                  key={s.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(s.angle) * s.distance,
                    y: Math.sin(s.angle) * s.distance,
                    opacity: 0,
                    scale: 0.4,
                  }}
                  transition={{ duration: 0.45, delay: s.delay, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    width: s.size,
                    height: s.size,
                    marginLeft: -s.size / 2,
                    marginTop: -s.size / 2,
                    borderRadius: "50%",
                    backgroundColor: color.accentViolet,
                    boxShadow: `0 0 4px 1px ${color.accentViolet}AA`,
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.div>
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
                <NodeFlash progress={progress} passT={passT} fade={pulseOpacity} />
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
