/**
 * Design tokens shared by every component. Import from here instead of
 * hardcoding colors, spacing, radii, fonts, or shadows.
 *
 * Palette: near-monochrome premium dark, one restrained signal accent
 * (steel blue) standing in for status/emphasis instead of decorative color.
 */

export const color = {
  background: "#08090B",
  backgroundElevated: "#0D0F12",
  surface: "#111318",
  surfaceRaised: "#15171D",
  border: "rgba(255, 255, 255, 0.08)",
  borderStrong: "rgba(255, 255, 255, 0.16)",
  text: "#F2F3F5",
  textMuted: "#9CA0AB",
  textFaint: "#5A5E68",
  accent: "#5B9FE8",
  accentHover: "#82B8F2",
  accentMuted: "rgba(91, 159, 232, 0.12)",
  accentText: "#08090B",
  signal: "#E8A94F",
  signalHover: "#F0BD70",
  signalMuted: "rgba(232, 169, 79, 0.14)",
  glass: "rgba(19, 21, 27, 0.55)",
  glassStrong: "rgba(22, 24, 31, 0.72)",
  glassBorder: "rgba(255, 255, 255, 0.14)",
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

export const radius = {
  sm: 3,
  md: 8,
  lg: 14,
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
    xs: 12,
    sm: 14,
    md: 16.5,
    lg: 21,
    xl: 32,
    xxl: 52,
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
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
  accentGlow: "radial-gradient(circle at 25% 15%, rgba(91,159,232,0.14), transparent 55%)",
  signalToAccent: "linear-gradient(90deg, #E8A94F, #5B9FE8)",
} as const

export const ease = {
  precise: [0.16, 1, 0.3, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
}
