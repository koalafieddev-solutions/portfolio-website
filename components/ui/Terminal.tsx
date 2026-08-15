"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, radius, space, font, shadow } from "../../lib/theme"
import { fadeUp } from "../../lib/animations"

export interface TerminalLine {
  type: "cmd" | "output"
  text: string
}

export interface TerminalProps {
  title?: string
  lines: TerminalLine[]
}

const CHAR_DELAY_MS = 28
const LINE_PAUSE_MS = 250
const OUTPUT_REVEAL_MS = 150

export function Terminal({ title = "koalafied-dev — zsh", lines }: TerminalProps) {
  const [visibleCount, setVisibleCount] = React.useState(0)
  const [typedLength, setTypedLength] = React.useState(0)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    let charTimer: ReturnType<typeof setTimeout>
    let lineTimer: ReturnType<typeof setTimeout>

    function typeLine(index: number) {
      if (cancelled) return
      if (index >= lines.length) {
        setDone(true)
        return
      }

      const line = lines[index]

      if (line.type === "output") {
        lineTimer = setTimeout(() => {
          if (cancelled) return
          setVisibleCount(index + 1)
          typeLine(index + 1)
        }, OUTPUT_REVEAL_MS)
        return
      }

      let pos = 0
      const tick = () => {
        if (cancelled) return
        pos++
        setTypedLength(pos)
        if (pos < line.text.length) {
          charTimer = setTimeout(tick, CHAR_DELAY_MS)
        } else {
          lineTimer = setTimeout(() => {
            if (cancelled) return
            setVisibleCount(index + 1)
            setTypedLength(0)
            typeLine(index + 1)
          }, LINE_PAUSE_MS)
        }
      }
      tick()
    }

    typeLine(0)

    return () => {
      cancelled = true
      clearTimeout(charTimer)
      clearTimeout(lineTimer)
    }
  }, [lines])

  return (
    <motion.div
      variants={fadeUp}
      style={{
        width: "100%",
        maxWidth: 480,
        textAlign: "left",
        backgroundColor: "rgba(20, 20, 22, 0.9)",
        border: `1px solid ${color.border}`,
        borderRadius: radius.md,
        boxShadow: shadow.lg,
        overflow: "hidden",
        fontFamily: font.mono,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: space.xs,
          padding: `${space.xs}px ${space.sm}px`,
          borderBottom: `1px solid ${color.border}`,
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FF5F56" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#FFBD2E" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#27C93F" }} />
        <span
          style={{
            marginLeft: space.xs,
            color: color.textFaint,
            fontSize: font.size.xs,
          }}
        >
          {title}
        </span>
      </div>

      {/* Every row (including the trailing cursor prompt) is mounted from the first
          render so the window is already its final size — only text opacity animates,
          nothing ever resizes. */}
      <div style={{ padding: space.md, display: "flex", flexDirection: "column", gap: space.xxs }}>
        {lines.map((line, index) => {
          if (line.type === "output") {
            const revealed = index < visibleCount
            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  fontSize: font.size.sm,
                  lineHeight: 1.7,
                  opacity: revealed ? 1 : 0,
                  transition: "opacity 0.25s ease-out",
                }}
              >
                <span style={{ width: space.md, flexShrink: 0 }} />
                <span style={{ color: color.textMuted }}>{line.text}</span>
              </div>
            )
          }

          const isCompleted = index < visibleCount
          const isActive = index === visibleCount && !done
          const isReached = index <= visibleCount
          const shownText = isCompleted ? line.text : isActive ? line.text.slice(0, typedLength) : ""

          return (
            <div
              key={index}
              style={{
                fontSize: font.size.sm,
                lineHeight: 1.7,
                opacity: isReached ? 1 : 0,
                transition: "opacity 0.15s ease-out",
              }}
            >
              <span style={{ color: color.accent }}>❯</span>{" "}
              <span style={{ color: color.text }}>{shownText}</span>
              {isActive ? (
                <motion.span
                  animate={{ opacity: [1, 1, 0, 0] }}
                  transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                  style={{ color: color.accent }}
                >
                  ▍
                </motion.span>
              ) : null}
            </div>
          )
        })}

        <div
          style={{
            fontSize: font.size.sm,
            lineHeight: 1.7,
            opacity: done ? 1 : 0,
            transition: "opacity 0.15s ease-out",
          }}
        >
          <span style={{ color: color.accent }}>❯</span>{" "}
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            style={{ color: color.accent }}
          >
            ▍
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
