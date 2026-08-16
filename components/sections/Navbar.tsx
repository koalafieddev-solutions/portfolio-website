"use client"

import * as React from "react"
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from "framer-motion"
import { color, space, font, layout, radius } from "../../lib/theme"
import { springSoft } from "../../lib/animations"
import { glassSurface } from "../../lib/glass"

// These panels only ever want a single edge, but glassSurface()'s border is
// longhand across all four sides — mixing that with a per-side override
// (borderBottom etc.) on the same framer-motion element trips its
// "conflicting style property" warning. Dropping the base border keys
// entirely and setting just the one edge avoids the overlap outright.
function glassSurfaceSingleEdge(edge: "borderBottom" | "borderTop") {
  const { borderWidth, borderStyle, borderColor, ...rest } = glassSurface()
  return { ...rest, [edge]: `1px solid ${color.glassBorder}` }
}

export interface NavLink {
  label: string
  href: string
}

export interface NavbarProps {
  brand: string
  links: NavLink[]
  ctaLabel?: string
  ctaHref?: string
}

function useActiveSection(links: NavLink[]) {
  const [activeHref, setActiveHref] = React.useState<string>("")

  React.useEffect(() => {
    const ids = links.map((l) => l.href.replace("#", "")).filter(Boolean)
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) => (a.boundingClientRect.top < b.boundingClientRect.top ? a : b))
          setActiveHref(`#${topMost.target.id}`)
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [links])

  return activeHref
}

// Boxed tab indicator — a bordered pill that slides between links via a
// shared layoutId, echoing the console's segmented tab bar (a filled box
// around the active tab, plain text everywhere else) rather than an
// underline.
function NavLinkItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <a
      href={link.href}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        color: active ? color.accentCyan : color.textMuted,
        fontFamily: font.mono,
        fontSize: font.size.xs,
        fontWeight: font.weight.medium,
        textTransform: "uppercase",
        letterSpacing: font.tracking.label,
        textDecoration: "none",
        padding: `6px ${space.sm}px`,
        transition: "color 0.18s ease-out",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = color.text
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = color.textMuted
      }}
    >
      {active ? (
        <motion.span
          layoutId="nav-active-tab"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{
            position: "absolute",
            inset: 0,
            border: `1px solid ${color.accentCyan}66`,
            borderRadius: radius.sm,
            backgroundColor: color.glassStrong,
            boxShadow: `0 0 16px -4px ${color.accentCyan}4D`,
            zIndex: -1,
          }}
        />
      ) : null}
      {link.label}
    </a>
  )
}

export function Navbar({ brand, links, ctaLabel, ctaHref }: NavbarProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const activeHref = useActiveSection(links)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.4 })
  const [scrollPercent, setScrollPercent] = React.useState(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => setScrollPercent(Math.round(v * 100)))

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={springSoft}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        ...glassSurfaceSingleEdge("borderBottom"),
        fontFamily: font.family,
      }}
    >
      <motion.div
        style={{
          scaleX: progress,
          transformOrigin: "0%",
          position: "absolute",
          top: -1,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: color.accentCyan,
          boxShadow: `0 0 8px ${color.accentCyan}80`,
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: layout.maxWidth,
          margin: "0 auto",
          padding: `${space.sm}px ${space.lg}px`,
        }}
      >
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: space.xs,
            color: color.text,
            fontFamily: font.mono,
            fontSize: font.size.sm,
            fontWeight: font.weight.semibold,
            letterSpacing: font.tracking.label,
            textTransform: "uppercase",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              position: "relative",
              width: 18,
              height: 18,
              flexShrink: 0,
              border: `1px solid ${color.text}`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ width: 5, height: 5, backgroundColor: color.accentCyan, borderRadius: "50%" }} />
          </span>
          {brand}
        </a>

        <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: space.lg }}>
          {links.map((link) => (
            <NavLinkItem key={link.href} link={link} active={activeHref === link.href} />
          ))}
          <span
            style={{
              fontFamily: font.mono,
              fontSize: font.size.xs,
              color: color.textFaint,
              letterSpacing: 0.5,
              paddingLeft: space.xs,
              borderLeft: `1px solid ${color.border}`,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(scrollPercent).padStart(2, "0")}%
          </span>
          {ctaLabel && ctaHref ? (
            <a
              href={ctaHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: `6px ${space.sm}px`,
                border: `1px solid ${color.borderStrong}`,
                color: color.text,
                fontFamily: font.mono,
                fontSize: font.size.xs,
                fontWeight: font.weight.semibold,
                textTransform: "uppercase",
                letterSpacing: font.tracking.label,
                textDecoration: "none",
                transition: "border-color 0.18s ease-out, background-color 0.18s ease-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = color.text
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = color.borderStrong
                e.currentTarget.style.backgroundColor = "transparent"
              }}
            >
              {ctaLabel}
            </a>
          ) : null}
        </nav>

        <button
          type="button"
          className="nav-toggle"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          style={{
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            background: "transparent",
            border: `1px solid ${color.border}`,
            borderRadius: radius.sm,
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 16 }}>
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 4.5 : 0 }}
              style={{ height: 1, width: "100%", backgroundColor: color.text, transformOrigin: "center" }}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              style={{ height: 1, width: "100%", backgroundColor: color.text }}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -4.5 : 0 }}
              style={{ height: 1, width: "100%", backgroundColor: color.text, transformOrigin: "center" }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            className="nav-mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{
              overflow: "hidden",
              ...glassSurfaceSingleEdge("borderTop"),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: `${space.sm}px ${space.lg}px ${space.md}px`,
                gap: space.sm,
              }}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    color: activeHref === link.href ? color.text : color.textMuted,
                    fontFamily: font.mono,
                    fontSize: font.size.sm,
                    fontWeight: font.weight.medium,
                    textTransform: "uppercase",
                    letterSpacing: font.tracking.label,
                    textDecoration: "none",
                    padding: `${space.xs}px 0`,
                  }}
                >
                  {link.label}
                </a>
              ))}
              {ctaLabel && ctaHref ? (
                <a
                  href={ctaHref}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    marginTop: space.xxs,
                    display: "inline-flex",
                    justifyContent: "center",
                    padding: `${space.xs}px 0`,
                    border: `1px solid ${color.borderStrong}`,
                    color: color.text,
                    fontFamily: font.mono,
                    fontSize: font.size.sm,
                    fontWeight: font.weight.semibold,
                    textTransform: "uppercase",
                    letterSpacing: font.tracking.label,
                    textDecoration: "none",
                  }}
                >
                  {ctaLabel}
                </a>
              ) : null}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  )
}
