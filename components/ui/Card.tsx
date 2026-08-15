"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, radius, space, font } from "../../lib/theme"
import { hoverLift, springSnappy } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"

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
}

export function Card({ title, description, image, tag, href, featured = false, meta, highlight = false }: CardProps) {
  const content = (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={hoverLift}
      style={{
        display: "flex",
        flexDirection: featured ? "row" : "column",
        flexWrap: featured ? "wrap" : "nowrap",
        ...glassSurface(),
        borderColor: highlight ? "rgba(232, 169, 79, 0.32)" : color.glassBorder,
        borderRadius: radius.lg,
        overflow: "hidden",
        fontFamily: font.family,
        cursor: href ? "pointer" : "default",
        height: "100%",
      }}
    >
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
          }}
        >
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.045 } }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
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
                borderRadius: radius.sm,
                backgroundColor: "rgba(232, 169, 79, 0.16)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
                border: "1px solid rgba(232, 169, 79, 0.4)",
                color: color.signalHover,
                fontFamily: font.mono,
                fontSize: font.size.xs,
                letterSpacing: 0.5,
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
        {tag ? (
          <span
            style={{
              color: color.textFaint,
              fontSize: font.size.xs,
              fontWeight: font.weight.semibold,
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            {tag}
          </span>
        ) : null}

        <h3
          style={{
            margin: 0,
            fontFamily: font.display,
            color: color.text,
            fontSize: featured ? font.size.xl : font.size.lg,
            fontWeight: font.weight.semibold,
            letterSpacing: -0.3,
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
                    color: color.accentHover,
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
                    letterSpacing: 0.5,
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
              fontSize: font.size.xs,
              fontWeight: font.weight.semibold,
              letterSpacing: 0.3,
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
