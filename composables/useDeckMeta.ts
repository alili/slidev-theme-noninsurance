/**
 * Presenter metadata for the per-slide footer (see components/CDFooter.vue).
 *
 * Resolution order, most specific first:
 *
 *  1. the slide's own frontmatter — `org:` / `speaker:` / `date:` written on that slide,
 *     so a single page can be re-attributed (a guest section, a different day);
 *  2. `themeConfig.org` / `themeConfig.speaker` / `themeConfig.date` — the deck-wide setting, and
 *     the one place to put it when the deck has no `cover`;
 *  3. the first slide that declares the field — in practice the `cover`, whose
 *     meta row already carries them. This is what makes the footer zero-config:
 *     a deck written before the footer existed gets it filled in for free.
 *
 * Nothing is invented when all three miss — an unset date renders as nothing
 * rather than "today", so exporting the same deck twice yields the same PNGs.
 */
import type { SlideRoute } from '@slidev/types'
import type { ComputedRef } from 'vue'
import { useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'

export interface DeckMeta {
  /** Organization / team, e.g. "平台工程部". */
  org?: string
  /** Presenter name, e.g. "张岭". */
  speaker?: string
  /** Presentation date, e.g. "2026.07.31". */
  date?: string
}

const FIELDS = ['org', 'speaker', 'date'] as const

export function useDeckMeta(): ComputedRef<DeckMeta> {
  const { $slidev, $frontmatter } = useSlideContext()
  const { slides } = useNav()

  return computed(() => {
    const themeConfig = ($slidev?.themeConfigs ?? {}) as Record<string, unknown>
    const meta: DeckMeta = {}
    for (const field of FIELDS) {
      meta[field] = asText($frontmatter?.[field])
        ?? asText(themeConfig[field])
        ?? asText(firstDeclared(slides.value, field))
    }
    return meta
  })
}

/** The value of `field` on the earliest slide that sets it, if any. */
function firstDeclared(slides: SlideRoute[] | undefined, field: string): unknown {
  for (const route of slides ?? []) {
    const value = route.meta?.slide?.frontmatter?.[field]
    if (value != null && value !== '')
      return value
  }
  return undefined
}

/**
 * Normalize a frontmatter value to display text.
 *
 * `date:` is the reason this is not a bare `String()`. The YAML 1.2 core schema
 * Slidev parses with keeps `2026-07-31` a string, but a deck may quote a real
 * timestamp, come through a YAML 1.1 pipeline, or set `themeConfig.date` from
 * JS — all of which hand us a `Date`. Its default `toString()` would print
 * "Fri Jul 31 2026 00:00:00 GMT+0800 (…)" across the footer, so format it.
 */
function asText(value: unknown): string | undefined {
  if (value == null || value === false || value === '')
    return undefined
  if (value instanceof Date)
    return formatDate(value)
  const text = String(value).trim()
  return text || undefined
}

/**
 * `YYYY.MM.DD`, matching the cover's meta row.
 *
 * Read in UTC on purpose: a date-only YAML timestamp resolves to midnight UTC,
 * and local getters would render the day before for anyone west of Greenwich.
 */
function formatDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getUTCFullYear()}.${pad(date.getUTCMonth() + 1)}.${pad(date.getUTCDate())}`
}
