"use client"

import * as React from "react"

// Fixed to the viewport (not the page), so this drifts continuously behind
// whatever section is currently on screen. Sits at a negative z-index below
// <main>'s transparent background and is covered wherever a section has its
// own opaque surface. Two elements:
//   1. A sparse, dim, slow-twinkling field of dots — reads as "space" at a
//      glance and otherwise stays out of the way.
//   2. A pair of large, very soft, slow-drifting color blobs (blue + amber).
//      These exist so the glass surfaces elsewhere on the page (Navbar,
//      Card, panels) have color underneath them to refract — without the
//      blobs themselves ever reading as decoration on their own.

const STAR_COUNT = 26

const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
  left: (i * 37.3 + 5) % 100,
  top: (i * 53.1 + i * i * 0.7) % 100,
  size: 1 + (i % 3 === 0 ? 1 : 0),
  duration: 4 + (i % 5) * 1.1,
  delay: (i % 7) * 0.6,
}))

export function AmbientBackground() {
  return (
    <div
      style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: -1 }}
      aria-hidden="true"
    >
      <span
        className="ambient-blob ambient-blob-accent"
        style={{
          position: "absolute",
          top: "-10%",
          left: "-8%",
          width: "52vw",
          height: "52vw",
          maxWidth: 720,
          maxHeight: 720,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91, 159, 232, 0.22), transparent 68%)",
          filter: "blur(60px)",
        }}
      />
      <span
        className="ambient-blob ambient-blob-signal"
        style={{
          position: "absolute",
          top: "38%",
          right: "-12%",
          width: "46vw",
          height: "46vw",
          maxWidth: 640,
          maxHeight: 640,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232, 169, 79, 0.16), transparent 68%)",
          filter: "blur(60px)",
        }}
      />

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
    </div>
  )
}
