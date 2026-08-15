"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { color, space, font, radius } from "../../lib/theme"
import { springSnappy } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"

export interface ContactButtonProps {
  email: string
  discord: string
}

interface ContactChipProps {
  label: string
  value: string
  accent: "blue" | "amber"
}

function ContactChip({ label, value, accent }: ContactChipProps) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>()
  const accentColor = accent === "amber" ? color.signal : color.accent

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(value).catch(() => {})
    }
    setCopied(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 2200)
  }

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      animate="rest"
      variants={{ rest: { y: 0 }, hover: { y: -2 } }}
      transition={springSnappy}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
        minWidth: 200,
        padding: `${space.sm}px ${space.md}px`,
        borderRadius: radius.md,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: font.family,
        ...glassSurface(),
        borderColor: copied ? accentColor : color.glassBorder,
        transition: "border-color 0.18s ease-out",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          color: color.textFaint,
          fontSize: font.size.xs,
          fontWeight: font.weight.semibold,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: accentColor }} />
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
                color: accentColor,
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
        <ContactChip label="Email" value={email} accent="blue" />
        <ContactChip label="Discord" value={discord} accent="amber" />
      </div>
    </div>
  )
}
