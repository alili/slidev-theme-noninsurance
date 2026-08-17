// Split a Slidev deck into its slides, without booting Slidev.
//
// Both screenshot scripts need to map an exported page back to what authored it
// (a `layout:` for the gallery, a heading for the README previews), and both
// need that mapping to break loudly rather than silently shuffle images when a
// deck is reordered. That shared parsing lives here.

import { readFileSync } from 'node:fs'

/**
 * Slide frontmatter blocks and slide separators are both `---` lines, so
 * splitting a deck on them yields [preamble, headmatter, body, yaml, body, …]:
 * every odd segment is a frontmatter block and the one after it is its body.
 *
 * This holds only while every slide declares frontmatter — which is the rule in
 * this repo's decks, since each one has to name its `layout:`. A slide without
 * it would shift the whole pairing, so the parse asserts it.
 *
 * @param {string} file absolute path to a deck's markdown
 * @returns {{ no: number, frontmatter: string, body: string, source: string }[]}
 *          one entry per slide, `no` being the 1-based page number
 */
export function readSlides(file) {
  const segments = readFileSync(file, 'utf8').split(/^---$/m)
  const slides = []
  for (let i = 1; i < segments.length; i += 2) {
    const frontmatter = segments[i]
    const body = segments[i + 1] ?? ''
    const no = (i + 1) / 2
    if (!/^\w[\w-]*:/m.test(frontmatter))
      throw new Error(`${file}: slide ${no} has no frontmatter — the \`---\` pairing cannot be trusted`)
    slides.push({ no, frontmatter, body, source: `${frontmatter}\n${body}` })
  }
  return slides
}

/** The `layout:` each slide declares, in page order. Every slide must have one. */
export function readLayouts(file) {
  return readSlides(file).map(({ no, frontmatter }) => {
    const match = frontmatter.match(/^layout:\s*(\S+)\s*$/m)
    if (!match)
      throw new Error(`${file}: slide ${no} has no \`layout:\` in its frontmatter`)
    return match[1]
  })
}

/**
 * The page number of the one slide whose source contains `needle`.
 * Ambiguous and missing markers are both errors — a preview image silently
 * pointing at the wrong slide is worse than a failed regeneration.
 */
export function findSlideNo(slides, needle, file) {
  const hits = slides.filter(slide => slide.source.includes(needle))
  if (hits.length === 0)
    throw new Error(`${file}: no slide contains ${JSON.stringify(needle)}`)
  if (hits.length > 1)
    throw new Error(`${file}: ${hits.length} slides contain ${JSON.stringify(needle)} (pages ${hits.map(h => h.no).join(', ')})`)
  return hits[0].no
}
