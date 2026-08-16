import * as React from "react"
import { color, space, font } from "../../lib/theme"

export interface SectionHeadingProps {
  heading: string
  subheading?: string
  index?: string
  accent?: string
}

export function SectionHeading({ heading, subheading, index, accent = color.accentCyan }: SectionHeadingProps) {
  return (
    <div style={{ marginBottom: space.xl, textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: space.xs,
          marginBottom: space.sm,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            flexShrink: 0,
            borderRadius: "50%",
            backgroundColor: accent,
            boxShadow: `0 0 8px 1px ${accent}66`,
          }}
        />
        {index ? (
          <span
            style={{
              fontFamily: font.mono,
              color: accent,
              fontSize: font.size.xs,
              letterSpacing: font.tracking.label,
              textTransform: "uppercase",
            }}
          >
            {index}
          </span>
        ) : null}
        <span
          style={{
            width: 20,
            height: 1,
            backgroundColor: color.borderStrong,
          }}
        />
      </div>

      <h2
        style={{
          margin: "0 auto",
          maxWidth: 680,
          fontFamily: font.display,
          color: color.text,
          fontSize: "clamp(1.4rem, 4.6vw, 2rem)",
          fontWeight: font.weight.semibold,
          letterSpacing: font.tracking.heading,
          textTransform: "uppercase",
        }}
      >
        {heading}
      </h2>

      {subheading ? (
        <p
          style={{
            margin: `${space.sm}px auto 0`,
            color: color.textMuted,
            fontSize: font.size.sm,
            lineHeight: 1.6,
            maxWidth: 560,
          }}
        >
          {subheading}
        </p>
      ) : null}
    </div>
  )
}
