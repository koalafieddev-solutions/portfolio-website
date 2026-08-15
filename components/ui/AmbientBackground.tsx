"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"

// Fixed to the viewport, so this drifts continuously behind whatever
// section is currently on screen — but each layer now also carries its own
// scroll-linked parallax rate (further-back layers move less), which is
// what actually reads as depth rather than a single flat backdrop:
//   1. Two heavily-blurred "radar ring" fields — pure texture, furthest back.
//   2. A faint drifting blueprint grid.
//   3. Three large, soft, slow-drifting color fields (blue / amber / violet).
//   4. A dense field of slow-twinkling stars, its own depth plane.
//   5. A fixed HUD scanline texture over the very top of the stack.

const STAR_COUNT = 60

const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  left: (i * 23.7 + 5) % 100,
  top: (i * 31.9 + i * i * 0.4) % 100,
  size: 1 + (i % 4 === 0 ? 1 : 0),
  duration: 3.5 + (i % 6) * 0.9,
  delay: (i % 9) * 0.5,
}))

export function AmbientBackground() {
  const { scrollY } = useScroll()
  // Clamped ranges (useTransform's default behavior), not unbounded
  // multiplication — otherwise offset grows without limit on a long page
  // and eventually exceeds any fixed layer's own oversize margin, which is
  // exactly what shows up as a seam/gap at the viewport edge. Each layer
  // below is sized well beyond the viewport specifically to absorb its max.
  const radarY = useTransform(scrollY, [0, 3000], [0, 36])
  const gridY = useTransform(scrollY, [0, 3000], [0, 56])
  const blobY = useTransform(scrollY, [0, 3000], [0, 84])
  const starY = useTransform(scrollY, [0, 3000], [0, 38])

  return (
    <>
      <motion.div className="hud-radar-texture" style={{ y: radarY }} aria-hidden="true" />
      <motion.div className="hud-radar-texture-b" style={{ y: radarY }} aria-hidden="true" />
      <motion.div className="hud-grid" style={{ y: gridY }} aria-hidden="true" />

      <motion.div
        style={{
          position: "fixed",
          inset: "-140px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1,
          y: blobY,
        }}
        aria-hidden="true"
      >
        <span
          className="ambient-blob ambient-blob-accent"
          style={{
            position: "absolute",
            top: "-14%",
            left: "-10%",
            width: "58vw",
            height: "58vw",
            maxWidth: 800,
            maxHeight: 800,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74, 151, 245, 0.34), transparent 68%)",
            filter: "blur(70px)",
          }}
        />
        <span
          className="ambient-blob ambient-blob-signal"
          style={{
            position: "absolute",
            top: "34%",
            right: "-14%",
            width: "50vw",
            height: "50vw",
            maxWidth: 700,
            maxHeight: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245, 169, 58, 0.26), transparent 68%)",
            filter: "blur(70px)",
          }}
        />
        <span
          className="ambient-blob ambient-blob-violet"
          style={{
            position: "absolute",
            bottom: "-16%",
            left: "18%",
            width: "44vw",
            height: "44vw",
            maxWidth: 620,
            maxHeight: 620,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(192, 132, 252, 0.16), transparent 68%)",
            filter: "blur(70px)",
          }}
        />
      </motion.div>

      <motion.div
        style={{
          position: "fixed",
          inset: "-80px",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: -1,
          y: starY,
        }}
        aria-hidden="true"
      >
        {stars.map((star, i) => (
          <span
            key={`star-${i}`}
            className="star-dot"
            style={
              {
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>

      <div className="hud-scanlines" aria-hidden="true" />
    </>
  )
}
