"use client"

import * as React from "react"
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useMotionValueEvent, PanInfo } from "framer-motion"
import { color, space, font, radius, layout } from "../../lib/theme"
import { staggerContainer, fadeUp, springSnappy } from "../../lib/animations"
import { Card, CardImage, CardMeta } from "../ui/Card"
import { SectionHeading } from "../ui/SectionHeading"

export interface ScrollRowItem {
  title: string
  description: string
  tag?: string
  image?: CardImage
  href?: string
  meta?: CardMeta[]
  highlight?: boolean
}

export interface ScrollRowProps {
  heading: string
  subheading?: string
  items: ScrollRowItem[]
  sectionIndex?: string
  accent?: string
}

const THUMB_SIZE = 16

export function ScrollRow({ heading, subheading, items, sectionIndex, accent = color.accentCyan }: ScrollRowProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const barRef = React.useRef<HTMLDivElement>(null)
  const isDraggingRef = React.useRef(false)
  const [isDragging, setIsDragging] = React.useState(false)

  const { scrollXProgress } = useScroll({ container: trackRef })
  const progress = useSpring(scrollXProgress, { stiffness: 400, damping: 40, mass: 0.4 })
  const thumbX = useMotionValue(0)

  // Drive the thumb from the raw (unsprung) scroll progress, not the springed
  // "progress" value used for the fill bar — during drag, thumbX tracks the
  // pointer 1:1 with zero lag, so syncing from a lagging spring afterwards
  // would cause a visible snap at the exact moment of release.
  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    if (isDraggingRef.current) return
    const barWidth = barRef.current?.offsetWidth ?? 0
    thumbX.set(latest * Math.max(0, barWidth - THUMB_SIZE))
  })

  const handleDrag = (_event: PointerEvent, info: PanInfo) => {
    const track = trackRef.current
    const bar = barRef.current
    if (!track || !bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (info.point.x - rect.left) / rect.width))
    track.scrollLeft = ratio * (track.scrollWidth - track.clientWidth)
  }

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current
    const bar = barRef.current
    if (!track || !bar) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width))
    track.scrollTo({ left: ratio * (track.scrollWidth - track.clientWidth), behavior: "smooth" })
  }

  return (
    <section
      style={{
        maxWidth: layout.maxWidth,
        margin: "0 auto",
        padding: `${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      <SectionHeading heading={heading} subheading={subheading} index={sectionIndex} accent={accent} />

      <motion.div
        ref={trackRef}
        className="scroll-row-track"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1, margin: "0px 0px -80px 0px" }}
        variants={staggerContainer}
        style={{
          display: "flex",
          gap: space.md,
          overflowX: "auto",
          // overflow-x: auto forces the browser to also clip the y-axis
          // (there's no way to keep it genuinely "visible" once the other
          // axis isn't) — so cards' hover lift + shadow need real reserved
          // space here, or they'd get cut off at the track's own edge.
          paddingTop: space.md,
          paddingBottom: space.xl,
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            variants={fadeUp}
            style={{ flex: "0 0 280px" }}
          >
            <Card
              title={item.title}
              description={item.description}
              tag={item.tag}
              image={item.image}
              href={item.href}
              meta={item.meta}
              highlight={item.highlight}
            />
          </motion.div>
        ))}
      </motion.div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: space.sm,
          marginTop: space.md,
        }}
      >
        <div
          ref={barRef}
          onClick={handleSeek}
          style={{
            position: "relative",
            flex: 1,
            height: 1,
            backgroundColor: color.border,
            borderRadius: radius.pill,
            cursor: "pointer",
          }}
        >
          <motion.div
            style={{
              scaleX: progress,
              transformOrigin: "0%",
              height: "100%",
              borderRadius: radius.pill,
              background: `linear-gradient(90deg, ${color.textFaint}, ${accent})`,
            }}
          />

          <motion.div
            drag="x"
            dragConstraints={barRef}
            dragElastic={0.12}
            dragMomentum={false}
            onDrag={handleDrag}
            onDragStart={() => {
              isDraggingRef.current = true
              setIsDragging(true)
            }}
            onDragEnd={() => {
              isDraggingRef.current = false
              setIsDragging(false)
            }}
            onClick={(event) => event.stopPropagation()}
            initial="rest"
            animate={isDragging ? "drag" : "rest"}
            whileHover="hover"
            variants={{
              rest: { scale: 1 },
              hover: { scale: 1.3 },
              drag: { scale: 1.6 },
            }}
            transition={springSnappy}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              x: thumbX,
              y: "-50%",
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "none",
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <AnimatePresence>
              {isDragging ? (
                <motion.span
                  key="pulse"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.85, repeat: Infinity, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: `1px solid ${accent}`,
                  }}
                />
              ) : null}
            </AnimatePresence>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: accent,
                boxShadow: `0 0 0 3px ${color.accentMuted}`,
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
