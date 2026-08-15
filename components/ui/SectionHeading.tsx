import * as React from "react"
import { color, space, font } from "../../lib/theme"

export interface SectionHeadingProps {
  heading: string
  subheading?: string
  index?: string
}

export function SectionHeading({ heading, subheading, index }: SectionHeadingProps) {
  return (
    <div style={{ marginBottom: space.xl, textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: space.xs,
          marginBottom: space.xs,
        }}
      >
        {index ? (
          <span
            style={{
              fontFamily: font.mono,
              color: color.textFaint,
              fontSize: font.size.xs,
              letterSpacing: 1,
            }}
          >
            {index}
          </span>
        ) : null}
        <span
          style={{
            width: index ? 20 : 0,
            height: 1,
            backgroundColor: color.borderStrong,
          }}
        />
      </div>

      <h2
        style={{
          margin: "0 auto",
          maxWidth: 640,
          fontFamily: font.display,
          color: color.text,
          fontSize: "clamp(1.5rem, 5vw, 2rem)",
          fontWeight: font.weight.semibold,
          letterSpacing: -0.5,
        }}
      >
        {heading}
      </h2>

      {subheading ? (
        <p
          style={{
            margin: `${space.xs}px auto 0`,
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
