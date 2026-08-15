"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { color, space, font, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"

export interface HeroProps {
  eyebrow?: string
  headline: string
  subhead: string
  backgroundImage?: string
  children?: React.ReactNode
}

function CornerMark({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const vertical = position[0] === "t" ? { top: 0 } : { bottom: 0 }
  const horizontal = position[1] === "l" ? { left: 0 } : { right: 0 }
  const borderV = position[0] === "t" ? "borderTop" : "borderBottom"
  const borderH = position[1] === "l" ? "borderLeft" : "borderRight"

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        ...vertical,
        ...horizontal,
        width: 18,
        height: 18,
        [borderV]: `1px solid ${color.borderStrong}`,
        [borderH]: `1px solid ${color.borderStrong}`,
      }}
    />
  )
}

export function Hero({ eyebrow, headline, subhead, backgroundImage, children }: HeroProps) {
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(35)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 })
  const glowBackground = useTransform([springX, springY], ([x, y]) =>
    `radial-gradient(ellipse 520px 400px at ${x}% ${y}%, rgba(91, 159, 232, 0.09), transparent 72%)`
  )

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set(((event.clientX - rect.left) / rect.width) * 100)
    mouseY.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  const handlePointerLeave = () => {
    mouseX.set(50)
    mouseY.set(35)
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        fontFamily: font.family,
      }}
    >
      {backgroundImage ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
      ) : null}

      {/* soft accent glow that gently follows the cursor */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: glowBackground,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: space.sm,
          maxWidth: layout.maxWidth,
          margin: "0 auto",
          padding: `clamp(48px, 12vw, ${space.xxl}px) clamp(16px, 5vw, ${space.lg}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: space.md,
            padding: `clamp(24px, 6vw, ${space.xl}px) clamp(8px, 5vw, ${space.xxl}px)`,
          }}
        >
          <CornerMark position="tl" />
          <CornerMark position="tr" />
          <CornerMark position="bl" />
          <CornerMark position="br" />

          {eyebrow ? (
            <motion.span
              variants={fadeUp}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: space.xs,
                color: color.textMuted,
                fontSize: font.size.xs,
                fontWeight: font.weight.semibold,
                textTransform: "uppercase",
                letterSpacing: 1.4,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: color.accent }} />
              {eyebrow}
            </motion.span>
          ) : null}

          <motion.h1
            variants={fadeUp}
            style={{
              margin: 0,
              fontFamily: font.display,
              color: color.text,
              fontSize: "clamp(2.4rem, 5.4vw, 4rem)",
              fontWeight: font.weight.semibold,
              letterSpacing: "-0.02em",
              lineHeight: 1.06,
              maxWidth: 820,
            }}
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              margin: 0,
              color: color.textMuted,
              fontSize: "clamp(0.9rem, 3.6vw, 1.03125rem)",
              fontWeight: font.weight.regular,
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            {subhead}
          </motion.p>
        </div>

        {children ? (
          <motion.div
            variants={fadeUp}
            style={{
              marginTop: space.xs,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  )
}
