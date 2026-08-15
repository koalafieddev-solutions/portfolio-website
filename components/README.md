# Component conventions

- One component per file.
- Typed props via an exported `interface` (e.g. `export interface ButtonProps { ... }`).
- Always import design tokens (`color`, `space`, `radius`, `font`, `shadow`) from [`lib/theme.ts`](../lib/theme.ts). Never hardcode colors or spacing values inline.
- Import `motion` from `"framer-motion"`.
- Any component that uses `framer-motion` (hover/tap/scroll animations, hooks) needs a `"use client"` directive at the top of the file — Next.js renders everything as a server component by default, and animation APIs require the client.
- Reuse shared transitions/variants from [`lib/animations.ts`](../lib/animations.ts) instead of redefining spring/stagger timings per component.

## Folder structure

- `ui/` — small, reusable primitives (buttons, cards, badges, inputs). No section-specific layout or copy.
- `sections/` — page-level compositions that assemble `ui/` pieces into a section of the site (hero, grid, footer). These own layout, spacing between children, and entrance/scroll animation. Composed together in [`app/page.tsx`](../app/page.tsx).

## Content

- [`content/products.json`](../content/products.json) — the 5 commercial Unreal Engine marketplace assets.
- [`content/videos.json`](../content/videos.json) — tutorial/devlog videos from the Koalafied Dev YouTube channel.
- [`content/timeline.json`](../content/timeline.json) — career story milestones, feeds the `Timeline` section.
- `products.json` and `videos.json` feed `ProjectGrid`/`ScrollRow` and share the `ProjectGridItem`/`ScrollRowItem` shape (`title`, `description`, `tag?`, `image?`, `href?`, `meta?`, `highlight?`). `meta` is an optional `{ value, label }[]` stat row rendered at the bottom of the `Card` (used for units-shipped / live-since badges); `highlight` gives the card an accent glow border. Every `href` is currently an empty string — fill in the real Fab/Marketplace and YouTube links, then `Card` will render the item as a clickable link automatically.

## Suggested next components

- `Navigation`
- `SkillBadge`
- `ContactForm`
- `Footer` (currently inline in `app/page.tsx` — split out if it grows)
