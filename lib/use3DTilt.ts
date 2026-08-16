"use client"

import * as React from "react"
import { useMotionValue, useSpring } from "framer-motion"

/**
 * Pointer-driven 3D tilt — every panel that uses this reads as a physical
 * plate floating in space, tilting toward the cursor, rather than a flat
 * image with a shadow. Shared so the whole site tilts with the same feel
 * instead of each panel reinventing slightly different physics.
 */
export function use3DTilt(strength = 5) {
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 28, mass: 0.6 })
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 28, mass: 0.6 })

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    const px = (event.clientX - rect.left) / rect.width - 0.5
    const py = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(px * strength)
    rotateX.set(-py * strength)
  }

  const onPointerLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return {
    rotateX: springRotateX,
    rotateY: springRotateY,
    transformPerspective: 900,
    handlers: { onPointerMove, onPointerLeave },
  }
}
