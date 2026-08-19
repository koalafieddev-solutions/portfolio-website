"use client"

import { MotionConfig } from "framer-motion"

// Sitewide reduced-motion coverage in one place: `reducedMotion="user"`
// makes every transform-driven animation (x/y/scale/rotate — the fadeUp
// entrance slide, card hover-lift, button press, cursor-parallax tilt,
// scroll-row thumb, nav tab indicator, etc.) collapse to an instant jump
// for anyone with the OS-level reduced-motion preference on, without
// touching each component individually. Opacity/color/blur transitions
// are left alone, matching the "keep changes that aid comprehension"
// guidance — only the physical motion is stripped.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
