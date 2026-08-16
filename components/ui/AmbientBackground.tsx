"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { usePointerField } from "../../lib/usePointerField"

// Fixed to the viewport, so this drifts continuously behind whatever
// section is currently on screen. Kept deliberately restrained and
// monochrome — a faint schematic grid, a dot-matrix texture, a couple of
// slow-rotating orbit rings, and a handful of scattered instrument-panel
// line-art marks. Every layer carries its own scroll rate AND its own
// cursor-parallax depth factor (see usePointerField) — layers further back
// move less and in the same direction as the cursor; layers meant to read
// as "nearer" move more, and sometimes opposite — so the whole background
// reads as a shallow stack of physical planes rather than one flat image.

const markers: Array<{
  type: "cross" | "tick" | "circle"
  left: number
  top: number
  size: number
  blur: number
  opacity: number
}> = [
  { type: "cross", left: 9, top: 20, size: 10, blur: 0, opacity: 0.4 },
  { type: "tick", left: 84, top: 14, size: 16, blur: 1.5, opacity: 0.22 },
  { type: "circle", left: 16, top: 64, size: 20, blur: 2, opacity: 0.18 },
  { type: "cross", left: 91, top: 58, size: 8, blur: 0, opacity: 0.34 },
  { type: "tick", left: 56, top: 86, size: 14, blur: 2.5, opacity: 0.14 },
  { type: "circle", left: 72, top: 32, size: 11, blur: 0.5, opacity: 0.3 },
  { type: "cross", left: 32, top: 9, size: 12, blur: 3, opacity: 0.13 },
  { type: "tick", left: 6, top: 80, size: 18, blur: 1, opacity: 0.24 },
]

function HudMarker({ type, left, top, size, blur, opacity }: (typeof markers)[number]) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: `${left}%`,
    top: `${top}%`,
    width: size,
    height: size,
    filter: blur ? `blur(${blur}px)` : undefined,
    opacity,
  }

  if (type === "circle") {
    return <span style={{ ...base, border: "1px solid #fff", borderRadius: "50%" }} />
  }

  if (type === "tick") {
    return <span style={{ ...base, borderTop: "1px solid #fff", borderLeft: "1px solid #fff" }} />
  }

  return (
    <span style={base}>
      <span style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "#fff" }} />
      <span style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "#fff" }} />
    </span>
  )
}

// Large abstract circular geometry drifting slowly behind everything — a
// dashed ring rather than a solid one, so the slow rotation actually reads
// as motion instead of a static circle.
function OrbitRing({
  size,
  left,
  top,
  reverse = false,
  opacity = 0.12,
}: {
  size: number
  left: number
  top: number
  reverse?: boolean
  opacity?: number
}) {
  const r = size / 2 - 1
  return (
    <svg
      className={`hud-orbit${reverse ? " hud-orbit-slow" : ""}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: "absolute",
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
        opacity,
      }}
      aria-hidden="true"
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="1 16" />
      <circle cx={size / 2} cy={size / 2} r={r * 0.62} fill="none" stroke="#fff" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  )
}

export function AmbientBackground() {
  const { scrollY } = useScroll()
  // Clamped ranges (useTransform's default behavior), not unbounded
  // multiplication — otherwise offset grows without limit on a long page
  // and eventually exceeds any fixed layer's own oversize margin, which is
  // exactly what shows up as a seam/gap at the viewport edge.
  const gridScrollY = useTransform(scrollY, [0, 3000], [0, 56])
  const markerScrollY = useTransform(scrollY, [0, 3000], [0, 64])

  const pointer = usePointerField()
  const dotsX = useTransform(pointer.x, [-0.5, 0.5], [3, -3])
  const dotsY = useTransform(pointer.y, [-0.5, 0.5], [3, -3])
  const gridX = useTransform(pointer.x, [-0.5, 0.5], [-6, 6])
  const markerX = useTransform(pointer.x, [-0.5, 0.5], [-14, 14])
  const markerPointerY = useTransform(pointer.y, [-0.5, 0.5], [-10, 10])
  const markerY = useTransform([markerScrollY, markerPointerY], ([scroll, pointerOffset]: number[]) => scroll + pointerOffset)
  const orbitFarX = useTransform(pointer.x, [-0.5, 0.5], [8, -8])
  const orbitFarY = useTransform(pointer.y, [-0.5, 0.5], [5, -5])
  const orbitNearX = useTransform(pointer.x, [-0.5, 0.5], [-20, 20])
  const orbitNearY = useTransform(pointer.y, [-0.5, 0.5], [-14, 14])

  return (
    <>
      <div className="hud-vignette" aria-hidden="true" />
      <motion.div className="hud-dots" style={{ x: dotsX, y: dotsY }} aria-hidden="true" />
      <motion.div className="hud-grid" style={{ y: gridScrollY, x: gridX }} aria-hidden="true" />

      <motion.div
        style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", x: orbitFarX, y: orbitFarY }}
        aria-hidden="true"
      >
        <OrbitRing size={620} left={88} top={10} opacity={0.08} />
      </motion.div>
      <motion.div
        style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none", x: orbitNearX, y: orbitNearY }}
        aria-hidden="true"
      >
        <OrbitRing size={360} left={4} top={82} reverse opacity={0.13} />
      </motion.div>

      <motion.div
        style={{
          position: "fixed",
          inset: "-100px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1,
          y: markerY,
          x: markerX,
        }}
        aria-hidden="true"
      >
        {markers.map((marker, i) => (
          <HudMarker key={i} {...marker} />
        ))}
      </motion.div>

      <div className="hud-scanlines" aria-hidden="true" />
    </>
  )
}
