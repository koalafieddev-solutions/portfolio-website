/**
 * Design tokens shared by every component. Import from here instead of
 * hardcoding colors, spacing, radii, fonts, or shadows.
 *
 * Palette: monochrome instrument-panel rendered in frosted glass — near-black
 * background, translucent blurred surfaces, hairline borders with a faint
 * cool glow. One restrained cyan-white sci-fi accent for status/glow,
 * used sparingly rather than as decoration.
 */

export const color = {
  background: "#08090B",
  backgroundElevated: "#0B0C0F",
  surface: "#0E0F13",
  surfaceRaised: "#131419",
  border: "rgba(255, 255, 255, 0.09)",
  borderStrong: "rgba(255, 255, 255, 0.18)",
  text: "#F2F3F5",
  textMuted: "#9A9EA9",
  textFaint: "#55585F",
  accent: "#B9BFC9",
  accentHover: "#F2F3F5",
  accentMuted: "rgba(255, 255, 255, 0.06)",
  accentText: "#08090B",
  signal: "#9A9EA9",
  signalHover: "#F2F3F5",
  signalMuted: "rgba(255, 255, 255, 0.06)",
  status: "#7CD98C",
  glow: "#8FD8FF",
  glowMuted: "rgba(143, 216, 255, 0.14)",
  glass: "rgba(20, 24, 30, 0.46)",
  glassStrong: "rgba(24, 28, 36, 0.6)",
  glassBorder: "rgba(255, 255, 255, 0.14)",
  // Low-saturation secondary accents — spectral light through frosted
  // optical glass, never competing with the monochrome base. Used sparingly
  // for information hierarchy (violet/mint/amber), not as decoration.
  accentCyan: "#8FD8FF",
  accentViolet: "#B9AEDD",
  accentMint: "#8FDBC4",
  accentAmber: "#D9B98A",
} as const

// Backdrop-blur + shadow strength per Z-depth plane. Farther-back layers
// stay crisp with no blur; each plane above it blurs progressively less
// than the one it sits on, so nesting order reads correctly at a glance.
export const elevation = {
  panel: 32,
  nested: 18,
  floating: 12,
} as const

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 20,
  lg: 32,
  xl: 48,
  xxl: 96,
} as const

// Smooth, machined bevels rather than near-sharp corners — every panel,
// card, and button reads from these three sizes so the whole site rounds
// off consistently.
export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  pill: 999,
} as const

export const layout = {
  maxWidth: 1200,
} as const

export const font = {
  family: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  display: "var(--font-display), 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  size: {
    xs: 11.5,
    sm: 13.5,
    md: 16,
    lg: 20,
    xl: 32,
    xxl: 52,
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  tracking: {
    label: 1.6,
    heading: 0.5,
  },
} as const

export const shadow = {
  sm: "0 1px 2px rgba(0, 0, 0, 0.4)",
  md: "0 8px 24px rgba(0, 0, 0, 0.4)",
  lg: "0 20px 60px rgba(0, 0, 0, 0.5)",
  ring: "0 0 0 1px rgba(255, 255, 255, 0.08)",
} as const

export const gradient = {
  heroOverlay:
    "linear-gradient(180deg, rgba(8,9,11,0.25) 0%, rgba(8,9,11,0.85) 62%, rgba(8,9,11,1) 100%)",
  accentGlow: "radial-gradient(circle at 75% 20%, rgba(255,255,255,0.06), transparent 55%)",
  signalToAccent: "linear-gradient(90deg, #9A9EA9, #F2F3F5)",
} as const

export const ease = {
  precise: [0.16, 1, 0.3, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
}
