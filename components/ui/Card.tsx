"use client"

import * as React from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { color, radius, space, font } from "../../lib/theme"
import { hoverLift, springSnappy } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"
import { use3DTilt } from "../../lib/use3DTilt"
import { CornerBrackets } from "./CornerBrackets"

export interface CardImage {
  src: string
  alt?: string
}

const AUTO_ADVANCE_MS = 5000
const FADE_DURATION_MS = 500

// Drives the active index for a multi-image card: advances to the next
// image every AUTO_ADVANCE_MS, and — because the effect is keyed off
// `index` itself — a manual thumbnail click naturally re-arms the same 5s
// window rather than fighting an interval that keeps its own schedule.
function useGalleryIndex(length: number, reduceMotion: boolean) {
  const [index, setIndex] = React.useState(0)

  React.useEffect(() => {
    if (length <= 1 || reduceMotion) return
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % length)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(timer)
  }, [index, length, reduceMotion])

  return [index, setIndex] as const
}

// The main image itself, crossfading via AnimatePresence — old and new both
// render, absolutely stacked, while their opacities cross, so there's no
// gap for the card's dark glass background to show through mid-transition.
function GalleryImage({ src, alt, reduceMotion }: { src: string; alt: string; reduceMotion: boolean }) {
  const bgStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  if (reduceMotion) {
    return <div style={bgStyle} role="img" aria-label={alt} />
  }

  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={src}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: FADE_DURATION_MS / 1000, ease: "easeInOut" }}
        style={bgStyle}
        role="img"
        aria-label={alt}
      />
    </AnimatePresence>
  )
}

// A plain horizontal filmstrip, laid out as its own row below the image
// rather than layered on top of it — keeps the shot itself uncluttered and
// reads as a distinct control rather than an overlay fighting the artwork.
function GalleryThumbnails({
  images,
  index,
  onSelect,
  featured,
}: {
  images: CardImage[]
  index: number
  onSelect: (i: number) => void
  featured: boolean
}) {
  const uid = React.useId()

  return (
    <div
      style={{
        flexBasis: "100%",
        display: "flex",
        flexWrap: "wrap",
        gap: space.xs,
        padding: `${space.xs}px ${featured ? space.lg : space.md}px`,
        borderTop: `1px solid ${color.glassBorder}`,
      }}
    >
      {images.map((img, i) => (
        <button
          key={img.src}
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onSelect(i)
          }}
          aria-label={`Show image ${i + 1} of ${images.length}`}
          aria-current={i === index}
          style={{
            position: "relative",
            width: 44,
            height: 30,
            flexShrink: 0,
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${img.src})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 3,
              opacity: i === index ? 1 : 0.45,
              transition: "opacity 200ms ease",
            }}
          />
          {i === index ? (
            <motion.div
              layoutId={`${uid}-thumb-underline`}
              transition={springSnappy}
              style={{
                position: "absolute",
                left: 2,
                right: 2,
                bottom: -4,
                height: 2,
                borderRadius: 1,
                backgroundColor: color.accentCyan,
              }}
            />
          ) : null}
        </button>
      ))}
    </div>
  )
}

export interface CardMeta {
  value: string
  label: string
}

// The same low-saturation accent set used everywhere else on the site,
// just a plain text color here rather than a bordered chip, so multiple
// tags read as a clean colored label row instead of a row of boxes.
const TAG_ACCENTS = [color.accentCyan, color.accentViolet, color.accentMint, color.accentAmber]

function hashTag(tag: string): number {
  let h = 0
  for (let i = 0; i < tag.length; i++) {
    h = (h * 31 + tag.charCodeAt(i)) >>> 0
  }
  return h
}

// Colors are keyed off each tag's own text (so "Multiplayer" reads the same
// color on every card) rather than its position in the array — plain
// position-based cycling meant two completely unrelated tags that just
// happened to both sit first in their list always landed on the same
// color, which read as arbitrary. Collisions are then nudged to the next
// free slot so tags sharing one card never render identically, even though
// a small fixed palette can't guarantee uniqueness across every card.
function assignTagColors(tags: string[]): string[] {
  const used = new Set<number>()
  return tags.map((t) => {
    let idx = hashTag(t) % TAG_ACCENTS.length
    let attempts = 0
    while (used.has(idx) && attempts < TAG_ACCENTS.length) {
      idx = (idx + 1) % TAG_ACCENTS.length
      attempts++
    }
    used.add(idx)
    return TAG_ACCENTS[idx]
  })
}

export interface CardProps {
  title: string
  description: string
  image?: CardImage
  // When set (2+ entries), overrides `image` with a self-looping crossfade
  // through every entry — for a project with multiple shots worth cycling
  // through on their own rather than picking just one static image.
  images?: CardImage[]
  tag?: string
  // Multiple relevant-topic chips (distinct from the single `tag` badge
  // next to the index number) — rendered as its own row beneath the
  // description, for cards that need to surface several related areas
  // (e.g. a software project touching VR + Physics + Multiplayer) rather
  // than one category label.
  tags?: string[]
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
  images,
  tag,
  tags,
  href,
  featured = false,
  meta,
  highlight = false,
  index,
}: CardProps) {
  const tilt = use3DTilt()
  const reduceMotion = useReducedMotion()
  const tagColors = tags && tags.length > 0 ? assignTagColors(tags) : []
  const loopImages = images && images.length > 0 ? images : image ? [image] : []
  const [galleryIndex, setGalleryIndex] = useGalleryIndex(loopImages.length, !!reduceMotion)
  const activeImage = loopImages[galleryIndex]

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

      {loopImages.length > 0 ? (
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
          <GalleryImage src={activeImage.src} alt={activeImage.alt ?? title} reduceMotion={!!reduceMotion} />
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

      {loopImages.length > 1 ? (
        <GalleryThumbnails images={loopImages} index={galleryIndex} onSelect={setGalleryIndex} featured={featured} />
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
        {tag || index || (tags && tags.length > 0) ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: space.xs }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                flexWrap: "wrap",
                rowGap: 2,
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
              {index && (tag || (tags && tags.length > 0)) ? <span aria-hidden="true">/</span> : null}
              {tags && tags.length > 0
                ? tags.map((t, i) => (
                    <React.Fragment key={t}>
                      {i > 0 ? <span aria-hidden="true">/</span> : null}
                      <span style={{ color: tagColors[i] }}>{t}</span>
                    </React.Fragment>
                  ))
                : tag}
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
