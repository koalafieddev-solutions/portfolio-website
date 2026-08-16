"use client"

import * as React from "react"
import { useMotionValue, useSpring } from "framer-motion"

/**
 * Window-level cursor position, normalized to roughly -0.5..0.5 on each
 * axis and spring-smoothed. Independent background/foreground layers each
 * read this and multiply by their own depth factor — a small factor for a
 * background plane, a larger (and often inverted) factor for something
 * near the viewer — so the whole interface parallaxes as a shallow 3D
 * volume instead of moving as one flat layer.
 */
export function usePointerField() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 40, damping: 18, mass: 0.9 })
  const springY = useSpring(y, { stiffness: 40, damping: 18, mass: 0.9 })

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return
      x.set(event.clientX / window.innerWidth - 0.5)
      y.set(event.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener("pointermove", handlePointerMove)
    return () => window.removeEventListener("pointermove", handlePointerMove)
  }, [x, y])

  return { x: springX, y: springY }
}
