"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { space, font, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { Card, CardImage, CardMeta } from "../ui/Card"
import { SectionHeading } from "../ui/SectionHeading"

export interface ProjectGridItem {
  title: string
  description: string
  tag?: string
  image?: CardImage
  href?: string
  meta?: CardMeta[]
  highlight?: boolean
}

export interface ProjectGridProps {
  heading?: string
  subheading?: string
  projects: ProjectGridItem[]
  columns?: number
  featuredIndex?: number
  sectionIndex?: string
}

export function ProjectGrid({ heading, subheading, projects, columns = 3, featuredIndex, sectionIndex }: ProjectGridProps) {
  const minItemWidth = Math.max(240, Math.floor(1240 / columns) - 40)

  return (
    <section
      style={{
        maxWidth: layout.maxWidth,
        margin: "0 auto",
        padding: `${space.lg}px`,
        fontFamily: font.family,
      }}
    >
      {heading ? <SectionHeading heading={heading} subheading={subheading} index={sectionIndex} /> : null}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={staggerContainer}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(auto-fit, minmax(min(${minItemWidth}px, 100%), 1fr))`,
          gap: space.lg,
        }}
      >
        {projects.map((project, index) => {
          const isFeatured = index === featuredIndex
          return (
            <motion.div
              key={`${project.title}-${index}`}
              variants={fadeUp}
              style={isFeatured ? { gridColumn: "1 / -1" } : undefined}
            >
              <Card
                title={project.title}
                description={project.description}
                tag={project.tag}
                image={project.image}
                href={project.href}
                featured={isFeatured}
                meta={project.meta}
                highlight={project.highlight}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
