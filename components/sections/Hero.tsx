"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { color, space, font, layout, radius } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { CornerBrackets } from "../ui/CornerBrackets"

export interface HeroProps {
  eyebrow?: string
  headline: React.ReactNode
  subhead: string
  backgroundImage?: string
  children?: React.ReactNode
}

// Small centered sci-fi emblem — a frosted-glass ring with tick marks and a
// crosshair center, standing in for a literal 3D asset while keeping the
// whole hero symmetric around a single vertical axis.
function HudEmblem() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "relative",
        width: 128,
        height: 128,
        borderRadius: "50%",
        ...glassSurface(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Outer div keeps glassSurface()'s own glow shadow un-clipped (overflow
          on the same element that casts it hides the shadow), so the photo
          gets clipped to a circle by this separate nested layer instead. The
          source badge is itself a circle tangent to all four edges of its
          square canvas, so a plain centered cover-fit crop reproduces the
          whole badge — dark ring included — with no square corners bleeding
          through, rather than zooming into one flat patch of it. */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/images/profile.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>
    </div>
  )
}

export function Hero({ eyebrow, headline, subhead, backgroundImage, children }: HeroProps) {
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(35)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20, mass: 0.6 })
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20, mass: 0.6 })
  const glowBackground = useTransform([springX, springY], ([x, y]) =>
    `radial-gradient(ellipse 560px 420px at ${x}% ${y}%, rgba(143, 216, 255, 0.05), transparent 72%)`
  )

  // Two more Z-planes reading off the same cursor position: the emblem
  // floats nearest the viewer, so it moves the most (and opposite the
  // cursor); the glass panel sits further back and moves less. Neither
  // uses springX/springY directly as a coordinate — only as a drift
  // input — so the panel never visibly tracks the pointer, just responds
  // to it.
  const emblemX = useTransform(springX, [0, 100], [12, -12])
  const emblemY = useTransform(springY, [0, 100], [8, -8])
  const panelX = useTransform(springX, [0, 100], [4, -4])
  const panelY = useTransform(springY, [0, 100], [3, -3])
  const panelRotateY = useTransform(springX, [0, 100], [-0.6, 0.6])
  const panelRotateX = useTransform(springY, [0, 100], [0.5, -0.5])

  // Micro-HUD coordinate readout — the same pointer position rendered as
  // engineering coordinates, echoing the reference's "X: 43.56 / Y: 19.76."
  const coordX = useTransform(springX, (v) => v.toFixed(2))
  const coordY = useTransform(springY, (v) => v.toFixed(2))

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

      {/* soft highlight that gently follows the cursor — restrained, cool-toned */}
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
          gap: space.lg,
          maxWidth: layout.maxWidth,
          margin: "0 auto",
          padding: `clamp(48px, 12vw, ${space.xxl}px) clamp(16px, 5vw, ${space.lg}px)`,
          textAlign: "center",
        }}
      >
        <motion.div variants={fadeUp} style={{ x: emblemX, y: emblemY }}>
          <HudEmblem />
        </motion.div>

        <motion.div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: space.md,
            padding: `clamp(28px, 6vw, ${space.xl}px) clamp(16px, 6vw, ${space.xxl}px)`,
            ...glassSurface(),
            borderRadius: radius.lg,
            x: panelX,
            y: panelY,
            rotateX: panelRotateX,
            rotateY: panelRotateY,
            transformPerspective: 1400,
          }}
        >
          <CornerBrackets corners={["tr", "bl", "br"]} tint={color.glassBorder} />

          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: space.sm,
              right: space.md,
              display: "flex",
              gap: space.sm,
              color: color.textFaint,
              fontFamily: font.mono,
              fontSize: 10,
              letterSpacing: font.tracking.label,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <span>
              X: <motion.span>{coordX}</motion.span>
            </span>
            <span>
              Y: <motion.span>{coordY}</motion.span>
            </span>
          </span>

          {eyebrow ? (
            <motion.span
              variants={fadeUp}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: space.xs,
                padding: `5px ${space.sm}px`,
                border: `1px solid ${color.border}`,
                color: color.textMuted,
                fontFamily: font.mono,
                fontSize: font.size.xs,
                fontWeight: font.weight.medium,
                textTransform: "uppercase",
                letterSpacing: font.tracking.label,
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color.status }} />
              {eyebrow}
            </motion.span>
          ) : null}

          <motion.h1
            variants={fadeUp}
            style={{
              margin: 0,
              fontFamily: font.display,
              color: color.text,
              fontSize: "clamp(2.2rem, 5.2vw, 3.6rem)",
              fontWeight: font.weight.semibold,
              letterSpacing: 0.2,
              textTransform: "uppercase",
              lineHeight: 1.1,
              maxWidth: 760,
            }}
          >
            {headline}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            style={{
              margin: 0,
              color: color.textMuted,
              fontSize: "clamp(0.9rem, 3.2vw, 1rem)",
              fontWeight: font.weight.regular,
              lineHeight: 1.65,
              maxWidth: 580,
            }}
          >
            {subhead}
          </motion.p>

          {children ? (
            <motion.div
              variants={fadeUp}
              style={{
                marginTop: space.xs,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: space.sm,
              }}
            >
              {children}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </motion.section>
  )
}
