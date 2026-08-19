"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { color, space, font, radius } from "../../lib/theme"
import { glassSurface } from "../../lib/glass"

export interface ContactButtonProps {
  email: string
  discord: string
}

interface ContactChipProps {
  label: string
  value: string
  accent: string
}

function CopyIcon({ size = 12, color: iconColor }: { size?: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
      <rect x="5.5" y="5.5" width="9" height="9" rx="1.5" stroke={iconColor} strokeWidth="1.2" />
      <path
        d="M3.5 10.5H2.5C1.94772 10.5 1.5 10.0523 1.5 9.5V2.5C1.5 1.94772 1.94772 1.5 2.5 1.5H9.5C10.0523 1.5 10.5 1.94772 10.5 2.5V3.5"
        stroke={iconColor}
        strokeWidth="1.2"
      />
    </svg>
  )
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

const SWEEP_DURATION = 0.6

function ContactChip({ label, value, accent }: ContactChipProps) {
  const [copied, setCopied] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)
  const [energized, setEnergized] = React.useState(false)
  const [confetti, setConfetti] = React.useState<ConfettiPiece[]>([])
  const copiedTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()
  const confettiTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()
  const energizeTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>()
  const seedRef = React.useRef(0)
  const sweepKeyRef = React.useRef(0)
  const successColor = color.status
  const reduceMotion = useReducedMotion()

  React.useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
      if (confettiTimeoutRef.current) clearTimeout(confettiTimeoutRef.current)
      if (energizeTimeoutRef.current) clearTimeout(energizeTimeoutRef.current)
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

  // Sheen sweeps once per hover-in, then the button settles into a held
  // "energized" glow for the rest of the hover — not a symmetric loop, so
  // there's nothing to animate backward (and look wrong) on hover-out.
  const handleHoverStart = () => {
    setHovered(true)
    setEnergized(false)
    sweepKeyRef.current += 1
    if (energizeTimeoutRef.current) clearTimeout(energizeTimeoutRef.current)
    energizeTimeoutRef.current = setTimeout(() => setEnergized(true), SWEEP_DURATION * 1000)
  }

  const handleHoverEnd = () => {
    setHovered(false)
    setEnergized(false)
    if (energizeTimeoutRef.current) clearTimeout(energizeTimeoutRef.current)
  }

  const glass = glassSurface()
  const glowColor = copied ? successColor : accent
  const charged = copied || energized

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.96 }}
      animate={copied ? { y: -2, scale: 1.06 } : "rest"}
      variants={{ rest: { y: 0, scale: 1 }, hover: { y: -3, scale: 1.015 } }}
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
        borderColor: charged ? glowColor : hovered ? color.borderStrong : color.glassBorder,
        boxShadow: charged
          ? `${glass.boxShadow}, 0 0 4px 1px ${glowColor}, 0 0 44px -6px ${glowColor}`
          : glass.boxShadow,
        transition: "border-color 0.2s ease-out, box-shadow 0.35s ease-out",
      }}
    >
      {/* Idle breathing glow — a faint, slow pulse behind the button so it
          reads as alive/interactive before the cursor ever reaches it. */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          animate={{ opacity: hovered ? 0 : [0.16, 0.4, 0.16] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: radius.sm,
            boxShadow: `0 0 22px -2px ${accent}80`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Energized wash — once the sheen finishes its pass, a warm tinted
          glow fills the glass and gently breathes for as long as the button
          stays hovered, reading as "charged up" rather than just outlined. */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: charged ? (reduceMotion ? 0.22 : [0.14, 0.3, 0.14]) : 0 }}
        transition={
          charged && !reduceMotion
            ? { duration: 1.7, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.25 }
        }
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius.sm,
          background: `radial-gradient(120% 130% at 50% 0%, ${glowColor}66, transparent 72%)`,
          pointerEvents: "none",
        }}
      />

      {/* Diagonal shine sweep — a single one-way light streak that glides
          across the glass on hover-in and is unmounted (never reversed) so
          it never plays backward on hover-out. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius.sm,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {hovered && !reduceMotion && (
          <motion.span
            key={sweepKeyRef.current}
            initial={{ x: "-160%" }}
            animate={{ x: "160%" }}
            transition={{ duration: SWEEP_DURATION, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "-40%",
              left: "-10%",
              width: "40%",
              height: "180%",
              background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.32), transparent)",
              transform: "skewX(-18deg)",
            }}
          />
        )}
      </div>

      {/* Copy affordance icon — fades and lifts in on hover, top-right. */}
      <motion.span
        aria-hidden
        variants={{ rest: { opacity: 0, scale: 0.85 }, hover: { opacity: 1, scale: 1 } }}
        transition={{ duration: 0.18 }}
        style={{
          position: "absolute",
          top: space.sm,
          right: space.sm,
        }}
      >
        <CopyIcon size={12} color={copied ? successColor : accent} />
      </motion.span>

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
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          paddingRight: space.md,
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

      <span style={{ position: "relative", zIndex: 1, display: "grid", width: "100%" }}>
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
        <ContactChip label="Email" value={email} accent={color.accentCyan} />
        <ContactChip label="Discord" value={discord} accent={color.accentViolet} />
      </div>
    </div>
  )
}
