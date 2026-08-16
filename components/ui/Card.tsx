"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, radius, space, font } from "../../lib/theme"
import { hoverLift, springSnappy } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { use3DTilt } from "../../lib/use3DTilt"
import { CornerBrackets } from "./CornerBrackets"

export interface CardImage {
  src: string
  alt?: string
}

export interface CardMeta {
  value: string
  label: string
}

export interface CardProps {
  title: string
  description: string
  image?: CardImage
  tag?: string
  href?: string
  featured?: boolean
  meta?: CardMeta[]
  highlight?: boolean
  index?: string
}

export function Card({
  title,
  description,
  image,
  tag,
  href,
  featured = false,
  meta,
  highlight = false,
  index,
}: CardProps) {
  const tilt = use3DTilt()

  const content = (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={hoverLift}
      {...tilt.handlers}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: featured ? "row" : "column",
        flexWrap: featured ? "wrap" : "nowrap",
        ...glassSurface(),
        borderColor: highlight ? color.borderStrong : color.glassBorder,
        borderRadius: radius.sm,
        // No overflow:hidden here — it would also clip this element's own
        // box-shadow (a well-known CSS gotcha), silently killing the depth
        // shadow from glassSurface()/hoverLift. The image wrapper below
        // carries its own matching border-radius + overflow:hidden instead,
        // so it still clips correctly without the outer card paying for it.
        fontFamily: font.family,
        cursor: href ? "pointer" : "default",
        height: "100%",
        transformPerspective: tilt.transformPerspective,
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      }}
    >
      <CornerBrackets corners={["tr"]} />

      {image?.src ? (
        <div
          style={{
            position: "relative",
            flex: featured ? "1 1 320px" : "0 0 auto",
            width: featured ? undefined : "100%",
            aspectRatio: featured ? undefined : "16 / 9",
            minHeight: featured ? 260 : undefined,
            alignSelf: featured ? "stretch" : undefined,
            overflow: "hidden",
            // Only the corners that actually sit on the card's own outer
            // edge get rounded to match it — rounding every corner would
            // carve a visible notch where the image meets the text block
            // below/beside it, since that div keeps square corners.
            borderRadius: featured ? `${radius.sm}px 0 0 ${radius.sm}px` : `${radius.sm}px ${radius.sm}px 0 0`,
          }}
        >
          {/* No independent hover-scale here — the whole card (via hoverLift
              on the outer motion.div) already scales up as one unit, and
              this image is a child of that, so it grows right along with
              it. A second scale on top of that compounded into the image
              visibly zooming faster than the rest of the card. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${image.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            role="img"
            aria-label={image.alt ?? title}
          />
          {highlight ? (
            <span
              style={{
                position: "absolute",
                top: space.sm,
                left: space.sm,
                padding: `3px ${space.xs}px`,
                backgroundColor: "rgba(8, 9, 11, 0.78)",
                border: `1px solid ${color.borderStrong}`,
                color: color.text,
                fontFamily: font.mono,
                fontSize: font.size.xs,
                letterSpacing: font.tracking.label,
                textTransform: "uppercase",
              }}
            >
              Featured
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: featured ? space.sm : space.xs,
          padding: featured ? space.lg : space.md,
          flex: featured ? "1 1 320px" : "1 1 auto",
          justifyContent: featured ? "center" : undefined,
        }}
      >
        {tag || index ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: space.xs }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: space.xs,
                fontFamily: font.mono,
                color: color.textFaint,
                fontSize: font.size.xs,
                fontWeight: font.weight.semibold,
                letterSpacing: font.tracking.label,
                textTransform: "uppercase",
              }}
            >
              {index ? <span style={{ color: color.accentCyan }}>{index}</span> : null}
              {index && tag ? <span aria-hidden="true">/</span> : null}
              {tag}
            </span>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                flexShrink: 0,
                backgroundColor: color.textFaint,
              }}
              aria-hidden="true"
            />
          </div>
        ) : null}

        <h3
          style={{
            margin: 0,
            fontFamily: font.display,
            color: color.text,
            fontSize: featured ? font.size.xl : font.size.lg,
            fontWeight: font.weight.semibold,
            letterSpacing: font.tracking.heading,
            textTransform: "uppercase",
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: 0,
            color: color.textMuted,
            fontSize: featured ? font.size.md : font.size.sm,
            fontWeight: font.weight.regular,
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>

        {meta && meta.length > 0 ? (
          <div
            style={{
              display: "flex",
              gap: featured ? space.lg : space.md,
              marginTop: "auto",
              paddingTop: space.sm,
            }}
          >
            {meta.map((item) => (
              <div key={item.label}>
                <div
                  style={{
                    fontFamily: font.mono,
                    color: color.text,
                    fontSize: featured ? font.size.lg : font.size.md,
                    fontWeight: font.weight.bold,
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    color: color.textFaint,
                    fontSize: font.size.xs,
                    textTransform: "uppercase",
                    letterSpacing: font.tracking.label,
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {href ? (
          <motion.span
            variants={{ rest: { x: 0, opacity: 0.55 }, hover: { x: 4, opacity: 1 } }}
            transition={springSnappy}
            style={{
              marginTop: meta && meta.length > 0 ? 0 : "auto",
              paddingTop: space.xs,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              color: color.text,
              fontFamily: font.mono,
              fontSize: font.size.xs,
              fontWeight: font.weight.semibold,
              letterSpacing: font.tracking.label,
              textTransform: "uppercase",
            }}
          >
            View <span aria-hidden="true">→</span>
          </motion.span>
        ) : null}
      </div>
    </motion.div>
  )

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
        {content}
      </a>
    )
  }

  return content
}
