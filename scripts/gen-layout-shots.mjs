// Regenerate the per-layout sample images used by the README gallery.
//
// `gallery.md` demonstrates exactly one layout per slide. Slidev exports the
// deck as 01.png…NN.png, so this script renames each page after the `layout:`
// declared in that slide's frontmatter — README links stay valid even when the
// gallery is reordered, and a mismatch between slides and pages fails loudly
// instead of silently shuffling the images.
//
// Usage: pnpm screenshot:layouts

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, readFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ENTRY = join(ROOT, 'gallery.md')
const OUT_DIR = join(ROOT, 'assets', 'layouts')

/**
 * Slide frontmatter and slide separators are both `---` lines, so splitting the
 * deck on them yields [preamble, yaml, body, yaml, body, …]: every odd segment
 * is a frontmatter block. Every slide in gallery.md must declare a layout.
 */
function readLayouts(file) {
  const segments = readFileSync(file, 'utf8').split(/^---$/m)
  const layouts = []
  for (let i = 1; i < segments.length; i += 2) {
    const match = segments[i].match(/^layout:\s*(\S+)\s*$/m)
    if (!match)
      throw new Error(`gallery.md: slide ${(i + 1) / 2} has no \`layout:\` in its frontmatter`)
    layouts.push(match[1])
  }
  return layouts
}

const layouts = readLayouts(ENTRY)
const duplicate = layouts.find((l, i) => layouts.indexOf(l) !== i)
if (duplicate)
  throw new Error(`gallery.md: layout "${duplicate}" appears on more than one slide`)

const tmp = mkdtempSync(join(tmpdir(), 'cd-layout-shots-'))
try {
  console.log(`[shots] exporting ${layouts.length} slides from gallery.md…`)
  execFileSync(
    process.execPath,
    [
      join(ROOT, 'node_modules/@slidev/cli/bin/slidev.mjs'),
      'export',
      ENTRY,
      '--format', 'png',
      '--output', tmp,
      '--scale', '1',
      '--dark',
      '--per-slide',
      '--wait', '1200',
      '--wait-until', 'networkidle',
    ],
    { cwd: ROOT, stdio: 'inherit' },
  )

  const pages = readdirSync(tmp).filter(f => f.endsWith('.png')).sort()
  if (pages.length !== layouts.length)
    throw new Error(`exported ${pages.length} pages but gallery.md declares ${layouts.length} layouts`)

  rmSync(OUT_DIR, { recursive: true, force: true })
  mkdirSync(OUT_DIR, { recursive: true })
  pages.forEach((page, i) => {
    copyFileSync(join(tmp, page), join(OUT_DIR, `${layouts[i]}.png`))
    console.log(`[shots] ${page} → assets/layouts/${layouts[i]}.png`)
  })
  console.log(`[shots] done — ${pages.length} images in assets/layouts/`)
}
finally {
  rmSync(tmp, { recursive: true, force: true })
}
