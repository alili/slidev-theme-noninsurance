import { computed, type ComputedRef } from 'vue'

/**
 * `title` is a reserved Slidev frontmatter field — it feeds the TOC and the
 * document title, and Slidev strips it (along with `layout`, `level`, `class`…)
 * before binding the remaining frontmatter to the layout component. A layout's
 * own `title` prop therefore never receives a `title:` written in a slide's
 * frontmatter, and the slide silently renders without a heading.
 *
 * Slidev does hand every layout the untouched `frontmatter` object, so read the
 * reserved field back from there. Use this in any layout that exposes a
 * `title` prop:
 *
 * ```ts
 * const props = defineProps<{ title?: string, frontmatter?: SlideFrontmatter }>()
 * const heading = useSlideTitle(props)
 * ```
 *
 * Precedence: an explicitly bound `title` prop → `title:` in the slide
 * frontmatter → the layout's own fallback (pass it here rather than as a
 * `withDefaults` value, or the default would mask the frontmatter).
 */
export interface SlideTitleProps {
  title?: string
  frontmatter?: Record<string, any>
}

export function useSlideTitle(
  props: SlideTitleProps,
  fallback?: string,
): ComputedRef<string | undefined> {
  return computed(() => props.title ?? props.frontmatter?.title ?? fallback)
}
