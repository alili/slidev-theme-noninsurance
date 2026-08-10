/**
 * Accent palette derivation — pure color math, no DOM.
 *
 * The deck's whole accent ramp is derived from a single primary color so that
 * `themeConfig.primary` is the only thing a user has to set. Derivation happens
 * in OKLCh rather than HSL: OKLCh lightness is perceptually uniform, so the same
 * lightness targets produce an evenly-spaced ramp for a red, a blue or a yellow
 * primary, where HSL would leave yellows washed out and blues muddy.
 *
 * The ramp uses fixed lightness targets (nudged so they never cross the base),
 * which keeps `deep < dim < light < bright` monotonic no matter how dark or
 * light the primary is. Chroma and hue are carried over from the primary; when a
 * target falls outside sRGB, chroma is reduced until it fits instead of the
 * channels being clipped, which would shift the hue.
 *
 * See composables/accent.ts for the runtime that reads `themeConfig.primary`
 * and publishes the result as `--cd-accent*` custom properties.
 */

/** sRGB, 0–255 per channel. */
export interface Rgb {
  r: number
  g: number
  b: number
}

/** OKLCh: L 0–1, C 0–~0.4, h in degrees. */
export interface Oklch {
  l: number
  c: number
  h: number
}

export interface AccentPalette {
  /** the primary itself, normalized to `#rrggbb` */
  accent: string
  /** `r, g, b` triplet, so CSS can compose its own alphas: rgba(var(--cd-accent-rgb), .4) */
  accentRgb: string
  /** darkest stop — chart backgrounds, the low end of sequential scales */
  deep: string
  /** dark stop — secondary series, borders that must recede */
  dim: string
  /** light stop — hover, diagram edges */
  light: string
  /** lightest stop — the high end of sequential scales */
  bright: string
  /** the primary at 18% alpha — inline code, chips */
  soft: string
  /** ink that stays readable on top of `accent` (full-accent slides, table heads) */
  onAccent: string
  /** deep → bright, for sequential scales (funnel, heatmap) */
  ramp: string[]
}

export interface DeriveOptions {
  /** light ink candidate for `onAccent` (defaults to the theme's --cd-fg) */
  ink?: string
  /** dark ink candidate for `onAccent` (defaults to the theme's --cd-bg) */
  paper?: string
}

/** The theme's own crimson — used whenever a primary can't be resolved. */
export const DEFAULT_PRIMARY = '#c81418'

const DEFAULT_INK = '#f2efee'
const DEFAULT_PAPER = '#08080a'

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v)

// ---------------------------------------------------------------------------
// sRGB ↔ OKLab/OKLCh (Björn Ottosson's matrices)
// ---------------------------------------------------------------------------

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
}

export function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const lr = srgbToLinear(r / 255)
  const lg = srgbToLinear(g / 255)
  const lb = srgbToLinear(b / 255)

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)

  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s

  const c = Math.sqrt(A * A + B * B)
  const h = c < 1e-6 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360
  return { l: L, c, h }
}

/** Raw OKLCh → sRGB, without gamut mapping; channels may fall outside 0–1. */
function oklchToRgbRaw({ l, c, h }: Oklch): { r: number, g: number, b: number } {
  const rad = (h * Math.PI) / 180
  const A = c * Math.cos(rad)
  const B = c * Math.sin(rad)

  const l_ = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m_ = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s_ = (l - 0.0894841775 * A - 1.2914855480 * B) ** 3

  return {
    r: linearToSrgb(4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_),
    g: linearToSrgb(-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_),
    b: linearToSrgb(-0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_),
  }
}

const inGamut = (c: { r: number, g: number, b: number }, eps = 1e-4) =>
  c.r >= -eps && c.r <= 1 + eps && c.g >= -eps && c.g <= 1 + eps && c.b >= -eps && c.b <= 1 + eps

/**
 * OKLCh → sRGB. Out-of-gamut colors have their chroma reduced (hue and
 * lightness preserved) until they fit, which desaturates gracefully instead of
 * clipping a channel and skewing the hue.
 */
export function oklchToRgb(color: Oklch): Rgb {
  let candidate = oklchToRgbRaw(color)
  if (!inGamut(candidate)) {
    let lo = 0
    let hi = color.c
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2
      const probe = oklchToRgbRaw({ ...color, c: mid })
      if (inGamut(probe)) lo = mid
      else hi = mid
    }
    candidate = oklchToRgbRaw({ ...color, c: lo })
  }
  return {
    r: Math.round(clamp(candidate.r, 0, 1) * 255),
    g: Math.round(clamp(candidate.g, 0, 1) * 255),
    b: Math.round(clamp(candidate.b, 0, 1) * 255),
  }
}

// ---------------------------------------------------------------------------
// parsing & formatting
// ---------------------------------------------------------------------------

/** Split a CSS function's arguments on commas and/or whitespace, dropping `/`. */
function args(body: string): string[] {
  return body.replace(/\//g, ' ').split(/[\s,]+/).filter(Boolean)
}

function num(token: string | undefined, scale = 1): number {
  if (!token) return Number.NaN
  const value = Number.parseFloat(token)
  if (Number.isNaN(value)) return Number.NaN
  return token.endsWith('%') ? (value / 100) * scale : value
}

function hueToRgb(p: number, q: number, t: number): number {
  let x = t
  if (x < 0) x += 1
  if (x > 1) x -= 1
  if (x < 1 / 6) return p + (q - p) * 6 * x
  if (x < 1 / 2) return q
  if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6
  return p
}

/**
 * Parse the CSS color syntaxes a `themeConfig.primary` is realistically written
 * in: hex (3/4/6/8), `rgb()`/`rgba()`, `hsl()`/`hsla()` and `oklch()`. Named
 * colors and anything more exotic go through the browser instead — see
 * `resolveColor()` in composables/accent.ts. Alpha is parsed but discarded: a
 * translucent accent would bleed the page background through every accent
 * surface in the deck.
 */
export function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase()
  if (!value) return null

  const hex = value.match(/^#([0-9a-f]{3,8})$/)
  if (hex) {
    const d = hex[1]
    const expand = (s: string) => Number.parseInt(s.length === 1 ? s + s : s, 16)
    if (d.length === 3 || d.length === 4)
      return { r: expand(d[0]), g: expand(d[1]), b: expand(d[2]) }
    if (d.length === 6 || d.length === 8)
      return { r: expand(d.slice(0, 2)), g: expand(d.slice(2, 4)), b: expand(d.slice(4, 6)) }
    return null
  }

  const fn = value.match(/^([a-z]+)\((.*)\)$/)
  if (!fn) return null
  const [, name, body] = fn
  const parts = args(body)

  if (name === 'rgb' || name === 'rgba') {
    const [r, g, b] = [num(parts[0], 255), num(parts[1], 255), num(parts[2], 255)]
    if ([r, g, b].some(Number.isNaN)) return null
    return { r: clamp(Math.round(r), 0, 255), g: clamp(Math.round(g), 0, 255), b: clamp(Math.round(b), 0, 255) }
  }

  if (name === 'hsl' || name === 'hsla') {
    const h = ((num(parts[0]) % 360) + 360) % 360 / 360
    const s = clamp(num(parts[1], 1), 0, 1)
    const l = clamp(num(parts[2], 1), 0, 1)
    if ([h, s, l].some(Number.isNaN)) return null
    if (s === 0) {
      const v = Math.round(l * 255)
      return { r: v, g: v, b: v }
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    return {
      r: Math.round(hueToRgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hueToRgb(p, q, h) * 255),
      b: Math.round(hueToRgb(p, q, h - 1 / 3) * 255),
    }
  }

  if (name === 'oklch') {
    const l = num(parts[0], 1)
    const c = num(parts[1], 0.4)
    const h = num(parts[2])
    if ([l, c, h].some(Number.isNaN)) return null
    return oklchToRgb({ l: clamp(l, 0, 1), c: Math.max(c, 0), h })
  }

  return null
}

export function toHex({ r, g, b }: Rgb): string {
  const hex = (v: number) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`
}

export function toRgbTriplet({ r, g, b }: Rgb): string {
  return `${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}`
}

export function withAlpha(color: Rgb | string, alpha: number): string {
  const rgb = typeof color === 'string' ? parseColor(color) : color
  if (!rgb) return 'transparent'
  return `rgba(${toRgbTriplet(rgb)}, ${alpha})`
}

// ---------------------------------------------------------------------------
// contrast
// ---------------------------------------------------------------------------

/** WCAG 2.1 relative luminance. */
export function relativeLuminance({ r, g, b }: Rgb): number {
  const [lr, lg, lb] = [r, g, b].map(v => srgbToLinear(v / 255))
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
}

/** WCAG 2.1 contrast ratio, 1–21. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/**
 * Whichever of the theme's two inks reads better on `background`. Used for the
 * full-accent layouts and for text sitting on an individual ramp stop — the top
 * of a light ramp needs the dark ink even when the base accent wanted the light
 * one.
 */
export function readableInk(background: Rgb | string, options: DeriveOptions = {}): string {
  const bg = typeof background === 'string' ? parseColor(background) : background
  const ink = parseColor(options.ink ?? DEFAULT_INK) ?? { r: 255, g: 255, b: 255 }
  const paper = parseColor(options.paper ?? DEFAULT_PAPER) ?? { r: 0, g: 0, b: 0 }
  if (!bg) return toHex(ink)
  return contrastRatio(bg, ink) >= contrastRatio(bg, paper) ? toHex(ink) : toHex(paper)
}

// ---------------------------------------------------------------------------
// derivation
// ---------------------------------------------------------------------------

/**
 * Lightness targets for the ramp. Each is nudged past the base so the ramp stays
 * ordered even when the primary is itself very dark or very light — a near-black
 * primary still gets stops above it, a pastel one still gets stops below it.
 */
function rampLightness(baseL: number) {
  return {
    deep: clamp(Math.min(0.26, baseL - 0.14), 0.06, 1),
    dim: clamp(Math.min(0.38, baseL - 0.06), 0.1, 1),
    light: clamp(Math.max(0.7, baseL + 0.06), 0, 0.94),
    bright: clamp(Math.max(0.84, baseL + 0.12), 0, 0.98),
  }
}

/**
 * Chroma for a stop at lightness `l`.
 *
 * Darkening at full chroma yields an unnaturally pure, neon-looking shade, so
 * chroma tapers linearly toward black — matching the hand-tuned crimson ramp
 * this theme started from (its dark stops sit within ~10% of this curve).
 * Lightening keeps the chroma instead: sRGB can still hold it, and tapering
 * toward white washes the highlight out well before the gamut requires it.
 * `oklchToRgb` reduces chroma anyway wherever the target doesn't fit.
 */
function rampChroma(baseL: number, baseC: number, l: number): number {
  return l < baseL ? (baseC * l) / baseL : baseC
}

/**
 * Derive the full accent ramp from a primary color.
 *
 * `onAccent` picks whichever of the two theme inks contrasts better with the
 * primary, so a full-accent slide (`section`, `fact`) stays readable with a
 * yellow primary just as it does with the default crimson.
 */
export function derivePalette(primary: Rgb, options: DeriveOptions = {}): AccentPalette {
  const base = rgbToOklch(primary)
  const targets = rampLightness(base.l)
  const at = (l: number) => toHex(oklchToRgb({ ...base, l, c: rampChroma(base.l, base.c, l) }))

  const onAccent = readableInk(primary, options)

  const deep = at(targets.deep)
  const dim = at(targets.dim)
  const accent = toHex(primary)
  const light = at(targets.light)
  const bright = at(targets.bright)

  return {
    accent,
    accentRgb: toRgbTriplet(primary),
    deep,
    dim,
    light,
    bright,
    soft: withAlpha(primary, 0.18),
    onAccent,
    ramp: [deep, dim, accent, light, bright],
  }
}
