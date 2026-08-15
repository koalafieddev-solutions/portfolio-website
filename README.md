# portfolio-website

Simon Cura's (Koalafied Dev) Unreal Engine portfolio. A Next.js + TypeScript
site with custom, modular, interactive React components animated with Framer
Motion — no page builder involved.

## Structure

```
portfolio-website/
├── app/
│   ├── layout.tsx        # root layout, fonts, global styles
│   ├── page.tsx           # homepage — hero, stats, products, tutorials
│   └── globals.css
├── components/
│   ├── ui/                # small reusable primitives (Button, Card)
│   ├── sections/           # page-level compositions (Hero, ProjectGrid, Timeline)
│   └── README.md           # component conventions
├── lib/
│   ├── theme.ts             # design tokens: color, space, radius, font, shadow
│   └── animations.ts        # shared Framer Motion transitions/variants
├── content/
│   ├── products.json        # 5 commercial Unreal Engine marketplace assets (with per-product stats)
│   ├── videos.json          # tutorial/devlog videos
│   └── timeline.json        # career story timeline, sourced from sales_history.xlsx dates
├── public/images/
│   ├── products/             # cover image per commercial asset
│   └── videos/               # thumbnail per tutorial/devlog video
├── package.json
├── tsconfig.json
└── next.config.mjs
```

## Setup

1. Install dependencies (Node 18+):

   ```bash
   npm install
   ```

2. Run the dev server:

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000.

3. Type-check:

   ```bash
   npm run typecheck
   ```

4. Build for production / deploy:

   ```bash
   npm run build
   ```

   The output deploys as-is to [Vercel](https://vercel.com) (recommended —
   `vercel` CLI or connect the repo in their dashboard) or any Node host that
   runs `npm start`.

## Content sourced from `content/commercial_assets/`

This site pulls from `../content/commercial_assets/` in the parent
`follow_the_white_rabbit` folder:

- **5 commercial products** (from the 5 product subfolders) → [`content/products.json`](content/products.json), cover images copied to `public/images/products/`. Each entry also carries a `meta` array (units shipped, year live) pulled from its `sales_history.xlsx` Summary sheet, and the Interaction System is marked `highlight: true`.
- **26 tutorial/devlog videos** (from `commercial_assets/youtube/`, minus the 5 already used as product covers) → [`content/videos.json`](content/videos.json), thumbnails copied to `public/images/videos/`.
- **Sales figures**: `sales_history.xlsx` files were aggregated into the homepage stats (255,641 total units) and per-product card stats. Dollar revenue is intentionally not displayed publicly — the site only ever showed unit counts, not the ~$12.8K net sales / $20.3K total recorded income figure, so that choice was preserved.
- **Story timeline**: [`content/timeline.json`](content/timeline.json) — a 7-entry career timeline built from the real first/latest sale dates in each product's `sales_history.xlsx` (e.g. Interaction System's June 2023 Epic "Free for the Month" feature, sourced from its Payout History sheet) plus the Aerospace Engineering degree. Rendered by [`components/sections/Timeline.tsx`](components/sections/Timeline.tsx).
- **Education**: [`content/education.json`](content/education.json), rendered by [`components/sections/Education.tsx`](components/sections/Education.tsx), sourced from `education/Transcript.pdf`. Shows degree, institution, honors (Dean's List / Honor Roll semesters, the perfect 4.000 term in Fall 2025), and astronautics coursework grouped by category. Cumulative GPA, individual course grades, student ID, and birthdate are intentionally left off — not relevant to a public portfolio.

**Still needed:** every `href` in `products.json` and `videos.json` is an
empty string. Add the real Fab/Marketplace listing URLs and YouTube video
URLs there, and `Card` will automatically render each item as a clickable
link.

## Editing content

- Hero copy and CTAs: [`app/page.tsx`](app/page.tsx).
- Products / videos: [`content/products.json`](content/products.json) and [`content/videos.json`](content/videos.json).
- Colors, spacing, type scale: [`lib/theme.ts`](lib/theme.ts) — every component reads from here, so editing it restyles the whole site.
- Motion timing: [`lib/animations.ts`](lib/animations.ts).

See [`components/README.md`](components/README.md) for component conventions
and a list of suggested next components (Navigation, Footer, ContactForm, ...).
