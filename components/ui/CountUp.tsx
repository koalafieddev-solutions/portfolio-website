"use client"

import * as React from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

export interface CountUpProps {
  value: string
}

export function CountUp({ value }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  const match = value.match(/\d[\d,]*/)
  const numeric = match ? parseInt(match[0].replace(/,/g, ""), 10) : null
  const prefix = match ? value.slice(0, match.index) : ""
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : ""

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 55, damping: 18 })
  const [display, setDisplay] = React.useState("0")

  React.useEffect(() => {
    if (inView && numeric !== null) motionValue.set(numeric)
  }, [inView, numeric, motionValue])

  React.useEffect(() => {
    if (numeric === null) return
    return springValue.on("change", (latest) => setDisplay(Math.round(latest).toLocaleString()))
  }, [numeric, springValue])

  if (numeric === null) {
    return <>{value}</>
  }

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
