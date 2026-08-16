"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { color, space, font, radius } from "../../lib/theme"
import { glassSurface } from "../../lib/glass"

export interface ContactButtonProps {
  email: string
  discord: string
}

interface ContactChipProps {
  label: string
  value: string
}

interface ConfettiPiece {
  id: number
  angle: number
  distance: number
  width: number
  height: number
  color: string
  rotate: number
  delay: number
}

const CONFETTI_COLORS = [color.status, color.accentCyan, color.accentMint, color.accentViolet, color.accentAmber]
const CONFETTI_COUNT = 18

function makeConfetti(seed: number): ConfettiPiece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => {
    const spread = (i / CONFETTI_COUNT) * Math.PI * 2
    return {
      id: seed + i,
      angle: spread + (Math.random() - 0.5) * 0.6,
      distance: 30 + Math.random() * 34,
      width: 3 + Math.random() * 3,
      height: 6 + Math.random() * 5,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      rotate: (Math.random() - 0.5) * 320,
      delay: Math.random() * 0.06,
    }
  })
}

function ContactChip({ label, value }: ContactChipProps) {
  const [copied, setCopied] = React.useState(false)
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([])
  const copiedTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()
  const confettiTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()
  const seedRef = React.useRef(0)
  const successColor = color.status

  React.useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current)
    }
  }, [])

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).catch(() => {})
    }
    setCopied(true)
    if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
    copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2200)

    seedRef.current += CONFETTI_COUNT
    setConfetti(makeConfetti(seedRef.current))
    if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current)
    confettiTimeoutRef.current = setTimeout(() => setConfetti([]), 850)
  }

  const glass = glassSurface()

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      animate={copied ? { y: -2, scale: 1.06 } : "rest"}
      variants={{ rest: { y: 0, scale: 1 }, hover: { y: -2, scale: 1 } }}
      transition={copied ? { type: "spring", stiffness: 500, damping: 13 } : { type: "spring", stiffness: 520, damping: 32, mass: 0.7 }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        minWidth: 200,
        padding: `${space.sm}px ${space.md}px`,
        borderRadius: radius.sm,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: font.family,
        overflow: "visible",
        ...glass,
        borderColor: copied ? successColor : color.glassBorder,
        boxShadow: copied ? `${glass.boxShadow}, 0 0 28px -2px ${successColor}80` : glass.boxShadow,
        transition: "border-color 0.18s ease-out, box-shadow 0.25s ease-out",
      }}
    >
      {/* Confetti burst — small paper-like rects flung outward from the
          button's center and faded/rotated away, purely decorative (no
          layout impact), cleared from state once the animation settles. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      >
        <AnimatePresence>
          {confetti.map((piece) => (
            <motion.span
              key={piece.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: Math.cos(piece.angle) * piece.distance,
                y: Math.sin(piece.angle) * piece.distance - 12,
                opacity: 0,
                rotate: piece.rotate,
              }}
              transition={{ duration: 0.7, delay: piece.delay, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                width: piece.width,
                height: piece.height,
                marginLeft: -piece.width / 2,
                marginTop: -piece.height / 2,
                backgroundColor: piece.color,
                borderRadius: 1,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: color.textFaint,
          fontFamily: font.mono,
          fontSize: font.size.xs,
          fontWeight: font.weight.semibold,
          letterSpacing: font.tracking.label,
          textTransform: "uppercase",
        }}
      >
        <span style={{ width: 5, height: 5, border: `1px solid ${color.textFaint}` }} />
        {label}
      </span>

      <span style={{ display: "grid", width: "100%" }}>
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.16 }}
              style={{
                gridArea: "1 / 1",
                color: successColor,
                fontSize: font.size.sm,
                fontWeight: font.weight.semibold,
              }}
            >
              Copied ✓
            </motion.span>
          ) : (
            <motion.span
              key="value"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.16 }}
              style={{
                gridArea: "1 / 1",
                color: color.text,
                fontSize: font.size.sm,
                fontWeight: font.weight.medium,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {value}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  )
}

export function ContactButton({ email, discord }: ContactButtonProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space.sm }}>
      <span
        style={{
          color: color.textFaint,
          fontSize: font.size.xs,
          fontWeight: font.weight.medium,
          letterSpacing: 0.4,
        }}
      >
        Click to copy
      </span>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: space.sm }}>
        <ContactChip label="Email" value={email} />
        <ContactChip label="Discord" value={discord} />
      </div>
    </div>
  )
}
