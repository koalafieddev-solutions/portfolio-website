"use client"

import * as React from "react"
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion"
import { color, space, font, layout } from "../../lib/theme"
import { glassSurface } from "../../lib/glass"

export interface NavLink {
  label: string
  href: string
}

export interface NavbarProps {
  brand: string
  links: NavLink[]
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

function NavLinkItem({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <a
      href={link.href}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        gap: 6,
        color: active ? color.text : color.textMuted,
        fontFamily: font.family,
        fontSize: font.size.sm,
        fontWeight: font.weight.medium,
        textDecoration: "none",
        padding: `${space.xxs}px 2px`,
        transition: "color 0.18s ease-out",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = color.text
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = color.textMuted
      }}
    >
      {link.label}
      <span style={{ position: "relative", height: 1, width: "100%" }}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: color.border,
          }}
        />
        <motion.span
          initial={false}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: color.accent,
            transformOrigin: "0%",
          }}
        />
      </span>
    </a>
  )
}

export function Navbar({ brand, links }: NavbarProps) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const activeHref = useActiveSection(links)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 300, damping: 40, mass: 0.4 })

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        ...glassSurface(),
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
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
          backgroundColor: color.accent,
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
            fontFamily: font.display,
            fontSize: font.size.md,
            fontWeight: font.weight.semibold,
            letterSpacing: -0.2,
            textDecoration: "none",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${color.accent}, ${color.signal})`,
              flexShrink: 0,
            }}
          />
          {brand}
        </a>

        <nav className="nav-links" style={{ display: "flex", gap: space.lg }}>
          {links.map((link) => (
            <NavLinkItem key={link.href} link={link} active={activeHref === link.href} />
          ))}
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
            borderRadius: 4,
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
              borderTop: `1px solid ${color.border}`,
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
                    fontSize: font.size.md,
                    fontWeight: font.weight.medium,
                    textDecoration: "none",
                    padding: `${space.xs}px 0`,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
