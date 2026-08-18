<script setup lang="ts">
/**
 * CDFooter — the band every slide carries along its bottom edge: org, presenter
 * and date on the left, page number on the right.
 *
 * It is mounted once per slide by the theme's `slide-top.vue` global layer, so
 * no layout — not even one a deck defines itself — has to place it. Everything
 * it renders is resolved per slide:
 *
 *   org / speaker / date  see composables/useDeckMeta.ts for the precedence chain
 *   page            the slide-local page injection rather than `nav.currentPage`,
 *                   so a non-`--per-slide` export, which mounts every page at
 *                   once, still numbers each page as itself
 *   variant         the slide's layout, because the band paints ABOVE the slide
 *                   and has to stay legible on a full-accent field or a photo
 *
 * Turn it off for one slide with `footer: false`, or deck-wide with
 * `themeConfig.footer: false`; `footer: true` forces it back onto a `cover`.
 */
import { useNav, useSlideContext } from '@slidev/client'
import { computed } from 'vue'
import { useDeckMeta } from '../composables/useDeckMeta'

/** Layouts that already end in their own meta row — a second one would double up. */
const HIDDEN_LAYOUTS = ['cover']
/** Layouts painted with the accent as their background (`--cd-on-accent` ink). */
const ON_ACCENT_LAYOUTS = ['section', 'fact']
/** Layouts whose bottom edge can be an arbitrary photo (needs a shadow). */
const ON_MEDIA_LAYOUTS = ['image-full']

const { $slidev, $page, $route, $frontmatter } = useSlideContext()
const { total } = useNav()

const meta = useDeckMeta()

const layout = computed(() =>
  $route?.meta?.layout ?? ($page.value === 1 ? 'cover' : 'default'),
)

const visible = computed(() => {
  // A slide's own `footer:` wins over everything, in both directions.
  const own = $frontmatter?.footer
  if (typeof own === 'boolean')
    return own
  if (($slidev?.themeConfigs as Record<string, unknown> | undefined)?.footer === false)
    return false
  return !HIDDEN_LAYOUTS.includes(layout.value)
})

const variantClass = computed(() => ({
  'cd-footer--on-accent': ON_ACCENT_LAYOUTS.includes(layout.value),
  'cd-footer--on-media': ON_MEDIA_LAYOUTS.includes(layout.value),
}))

// Zero-padded to the width of the deck, so the numerals stay column-aligned in
// the monospaced face as the page count crosses 10 / 100.
const page = computed(() => String($page.value).padStart(String(total.value).length, '0'))

// Leftmost first. Missing fields drop out; separators come from the template.
const items = computed(() =>
  [meta.value.org, meta.value.speaker, meta.value.date].filter((v): v is string => Boolean(v)),
)
</script>

<template>
  <div v-if="visible" class="cd-footer" :class="variantClass">
    <div class="cd-footer__meta">
      <template v-for="(item, i) in items" :key="i">
        <span v-if="i" class="cd-footer__sep">·</span>
        <span>{{ item }}</span>
      </template>
    </div>
    <div class="cd-footer__page">
      <span class="cd-footer__page-current">{{ page }}</span>
      <span class="cd-footer__page-total">/ {{ total }}</span>
    </div>
  </div>
</template>
