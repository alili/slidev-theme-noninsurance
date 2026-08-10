// Regenerate the README images that show a custom `themeConfig.primary` driving
// the whole deck.
//
// Two slides are rendered per primary: `section`, whose full-accent field shows
// the contrast-picked ink, and a funnel `chart`, whose five stages walk the
// derived accent ramp. Nothing but `themeConfig.primary` differs between the
// decks — that is the point of the images.
//
// Usage: pnpm screenshot:accents

import { execFileSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync, mkdirSync, copyFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'assets', 'accent')

const PRIMARIES = [
  { slug: 'crimson', color: '#C81418', label: '默认 · 深红' },
  { slug: 'blue', color: '#1E6FD9', label: '自定义 · 蓝' },
  { slug: 'amber', color: '#F2B90C', label: '自定义 · 琥珀' },
]

/** The two slides are identical across decks; only the headmatter primary moves. */
const deck = (color, label) => `---
theme: ./
canvasWidth: 1920
themeConfig:
  primary: '${color}'
layout: section
no: "01"
---

## ${label}

primary: ${color} — 其余配色全部由它推导

---
layout: chart
type: funnel
meta: 上半年 · 团队数
note: 漏斗的五级颜色来自主色推导出的色阶，层内文字按对比度自动选深浅
---

## 业务方接入转化
`

rmSync(OUT_DIR, { recursive: true, force: true })
mkdirSync(OUT_DIR, { recursive: true })

for (const { slug, color, label } of PRIMARIES) {
  // The deck has to sit in the repo root for `theme: ./` to resolve.
  const entry = join(ROOT, `.accent-${slug}.md`)
  const tmp = mkdtempSync(join(tmpdir(), `cd-accent-${slug}-`))
  writeFileSync(entry, deck(color, label))
  try {
    console.log(`[accents] rendering ${slug} (${color})…`)
    execFileSync(
      process.execPath,
      [
        join(ROOT, 'node_modules/@slidev/cli/bin/slidev.mjs'),
        'export', entry,
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
    if (pages.length !== 2)
      throw new Error(`expected 2 pages for ${slug}, got ${pages.length}`)
    copyFileSync(join(tmp, pages[0]), join(OUT_DIR, `${slug}-section.png`))
    copyFileSync(join(tmp, pages[1]), join(OUT_DIR, `${slug}-chart.png`))
    console.log(`[accents] ${slug} → assets/accent/${slug}-{section,chart}.png`)
  }
  finally {
    unlinkSync(entry)
    rmSync(tmp, { recursive: true, force: true })
  }
}

console.log(`[accents] done — ${PRIMARIES.length * 2} images in assets/accent/`)
