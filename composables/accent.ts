/**
 * Accent palette runtime.
 *
 * Reads the deck's accent color, derives the full ramp (see palette.ts) and
 * publishes it as `--cd-accent-*` custom properties, so CSS, ECharts and Mermaid
 * all draw from one source of truth.
 *
 * The source it reads is `--cd-accent`, not `themeConfig.primary` directly:
 * `styles/vars.css` defines `--cd-accent: var(--slidev-theme-primary)` and
 * Slidev writes `themeConfig.primary` onto `<body>`, so reading the resolved
 * token picks up both paths — `themeConfig.primary` and a hand-written
 * `--cd-accent` override — without this file knowing about either.
 *
 * The derived values are written into a `<style>` element rather than inline on
 * `:root`, so the normal cascade still applies: a deck's own stylesheet, which
 * Slidev loads after the theme's, can override any single stop.
 */
import type { AccentPalette, Rgb } from './palette'
import { DEFAULT_PRIMARY, derivePalette, parseColor } from './palette'

/** Fired on `window` after the palette is (re)derived — see components/CDChart.vue. */
export const ACCENT_CHANGE_EVENT = 'cd:accent-change'

const STYLE_ID = 'cd-accent-palette'
const SOURCE_VAR = '--cd-accent'

let palette: AccentPalette | null = null
let sourceKey = ''
let installed = false

/**
 * Resolve any CSS color to RGB. `parseColor` covers the syntaxes a primary is
 * realistically written in; anything else (named colors, `color()`,
 * `light-dark()`, …) is handed to the browser, which rejects invalid values at
 * the CSSOM level and reports a resolvable color for valid ones.
 */
export function resolveColor(input: string): Rgb | null {
  const direct = parseColor(input)
  if (direct) return direct
  if (typeof document === 'undefined' || !document.body) return null

  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;width:0;height:0;visibility:hidden'
  probe.style.color = input
  if (!probe.style.color) return null

  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()
  return parseColor(computed)
}

function readSource(): string {
  if (typeof document === 'undefined') return DEFAULT_PRIMARY
  const host = document.body ?? document.documentElement
  return getComputedStyle(host).getPropertyValue(SOURCE_VAR).trim() || DEFAULT_PRIMARY
}

/** Re-derive if the source color changed. Returns true when the palette moved. */
function refresh(): boolean {
  const key = readSource()
  if (palette && key === sourceKey) return false
  const rgb = resolveColor(key) ?? parseColor(DEFAULT_PRIMARY)!
  palette = derivePalette(rgb)
  sourceKey = key
  return true
}

function publish(): void {
  if (typeof document === 'undefined' || !palette) return
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }
  style.textContent = [
    ':root{',
    `--cd-accent-rgb:${palette.accentRgb};`,
    `--cd-accent-deep:${palette.deep};`,
    `--cd-accent-dim:${palette.dim};`,
    `--cd-accent-light:${palette.light};`,
    `--cd-accent-bright:${palette.bright};`,
    `--cd-accent-soft:${palette.soft};`,
    `--cd-on-accent:${palette.onAccent};`,
    '}',
  ].join('')
}

/** The current palette, derived on first use. Safe to call before install. */
export function accentPalette(): AccentPalette {
  if (!palette) refresh()
  return palette!
}

/**
 * Derive and publish the palette, then keep it in sync.
 *
 * The accent can land after this module runs, from two directions:
 *
 *  - `themeConfig.primary`, which Slidev applies to `<body style>` when the app
 *    mounts and rewrites on HMR — watched via the body attribute observer;
 *  - a `body { --cd-accent: … }` rule in the deck's own stylesheet, which Vite
 *    injects as a `<style>` after the theme's during dev — watched via the head
 *    child observer, with one post-task pass to cover anything that lands
 *    without mutating either.
 *
 * The immediate first derivation is what keeps the initial paint correct; the
 * watchers only ever upgrade it. Idempotent.
 */
export function installAccentPalette(): void {
  if (typeof document === 'undefined' || installed) return
  installed = true

  if (!document.body) {
    document.addEventListener('DOMContentLoaded', () => {
      installed = false
      installAccentPalette()
    }, { once: true })
    return
  }

  const sync = () => {
    if (!refresh()) return
    publish()
    window.dispatchEvent(new CustomEvent(ACCENT_CHANGE_EVENT))
  }

  refresh()
  publish()

  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['style'] })
  // Appending our own <style> below trips this observer once; `refresh()` sees an
  // unchanged source and returns false, so it settles immediately.
  new MutationObserver(sync).observe(document.head, { childList: true })
  requestAnimationFrame(sync)
}
