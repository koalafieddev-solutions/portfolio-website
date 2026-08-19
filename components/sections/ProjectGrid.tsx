"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { color, space, font, layout } from "../../lib/theme"
import { staggerContainer, fadeUp } from "../../lib/animations"
import { Card, CardImage, CardMeta } from "../ui/Card"
import { SectionHeading } from "../ui/SectionHeading"

export interface ProjectGridItem {
  title: string
  description: string
  tag?: string
  tags?: string[]
  image?: CardImage
  images?: CardImage[]
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
  // The per-card "N.01" badge — on by default (matches the commercial
  // assets grid), set false to drop it where a running item count doesn't
  // add anything (e.g. a project list that isn't meant to read as ranked).
  showItemIndex?: boolean
}

export function ProjectGrid({
  heading,
  subheading,
  projects,
  columns = 3,
  featuredIndex,
  sectionIndex,
  showItemIndex = true,
}: ProjectGridProps) {
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
      {heading ? (
        <SectionHeading heading={heading} subheading={subheading} index={sectionIndex} accent={color.accentCyan} />
      ) : null}

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
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
                tags={project.tags}
                image={project.image}
                images={project.images}
                href={project.href}
                featured={isFeatured}
                meta={project.meta}
                highlight={project.highlight}
                index={showItemIndex ? `N.${String(index + 1).padStart(2, "0")}` : undefined}
              />
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
