# slidev-theme-bestony2026

[![NPM version](https://img.shields.io/npm/v/slidev-theme-bestony2026?color=C81418&label=)](https://www.npmjs.com/package/slidev-theme-bestony2026)

**Crimson Deck** — a dark, crimson-accented [Slidev](https://github.com/slidevjs/slidev)
theme for technical reviews and product updates. Deep black surfaces, a single
crimson accent, Noto Sans SC for Chinese and JetBrains Mono for numbers/labels.
Ships **27 layouts**, 8 themed ECharts chart types, and crimson-styled Mermaid /
PlantUML / code blocks.

## Install

Add the theme to your slides' headmatter — Slidev will prompt to install it:

```yaml
---
theme: bestony2026
canvasWidth: 1920
---
```

> **Important:** this theme is designed on a **1920×1080** canvas. Set
> `canvasWidth: 1920` in your headmatter so every layout renders at the intended
> proportions. (The bundled `example.md` sets it for you.)

## Customization

- **Accent color** — driven by `themeConfig.primary`; defaults to crimson `rgb(200,20,24)`:

  ```yaml
  ---
  theme: bestony2026
  themeConfig:
    primary: '#1E6FD9'   # any color; the whole deck follows
  ---
  ```

- **Global scale** — every font size is `original × var(--cd-scale)`. Shrink or grow
  the whole deck by overriding `--cd-scale` (default `1`) in your own CSS.
- **Design tokens** — colors, type scale and spacing live in `styles/vars.css`
  as `--cd-*` custom properties; override any of them per-deck.

## Layouts

The theme is authored with a **mixed API**: structured, repeating content
(cards, metrics, timeline nodes…) comes from frontmatter props, while titles and
prose come from Markdown. Named slots use Slidev's `::name::` syntax.

See [`example.md`](./example.md) for a complete, working deck that uses **every**
layout with realistic content.

### Cover & structure

| Layout | Purpose | Key frontmatter / slots |
| --- | --- | --- |
| `cover` | Title slide (crimson glow, meta row) | `kicker`, `speaker`, `org`, `date` · slot: `# title` + `subtitle` |
| `intro` | Centered lead-in | slot: `# title` + `paragraph` |
| `section` | Chapter divider (full crimson) | `no` · slot: `## title` + `note` |
| `statement` | Big claim + supporting points | `points[{no,text}]` · slot: claim (use `**…**` to highlight) |
| `quote` | Pull quote | `author` · slot: quote text |
| `fact` | Emphasis / demo cue (full crimson) | `icon` (lucide) · slot: `## big` + `note` |
| `closing` | Decisions / asks | `items[]`, `footLeft`, `footRight` · slot: `## title` |
| `end` | Closing slide (big word) | `eyebrow`, `big` · slot: closing note |

### Content & data

| Layout | Purpose | Key frontmatter / slots |
| --- | --- | --- |
| `default` | Standard content slide | slot: Markdown (`#`, lists, `>`, tables) |
| `agenda` | Table of contents | `kicker`, `items[{no,title,desc}]` |
| `metrics` | Stat cards (crimson top rule) | `items[{value,unit,label,note}]` · slot: `## title` |
| `compare` | Before / after columns | `title`, `leftLabel`, `rightLabel` · slots: `::left::` `::right::` |
| `roadmap` | Milestones (4 columns) | `items[{phase,title,desc,active}]` · slot: `## title` |
| `timeline` | Horizontal timeline | `items[{time,title,desc,done}]` · slot: `## title` |
| `steps` | Numbered step cards + icons | `items[{icon,step,title,desc}]` · slot: `## title` |
| `table` | Data table | `title`, `meta`, `note` · slot: Markdown table |

### Media, code & charts

| Layout | Purpose | Key frontmatter / slots |
| --- | --- | --- |
| `image-full` | Full-bleed image + overlay text | `image`, `kicker`, `title`, `desc` |
| `image-left` | Visual left / text right | `image`, `split`, `kicker`, `bullets[]` · slots: `::image::` + text |
| `image-right` | Text left / visual right | `image`, `split` · slots: text + `::image::` |
| `image-grid` | 3-up image grid | `images[{src,title,desc}]` · slot: `## title` |
| `diagram` | Mermaid / diagram container | `title`, `label`, `notes[{key,text}]` · slot: ` ```mermaid ` |
| `chart` | Full-width ECharts | `type`, `meta`, `note` · slot: `## title` |
| `code` | Full-screen code | `title`, `file` · slot: fenced code |
| `code-cols` | Code + explanation | `file`, `kicker`, `items[{key,desc}]` · slots: `::code::` + text |
| `team` | Team grid (4-up) | `members[{photo,name,role}]` · slot: `## title` |
| `logos` | Logo wall (3×2) | `subtitle`, `logos[{src,name}]` · slot: `## title` |
| `contact` | Contact + QR code | `kicker`, `contacts[{icon,label,value}]`, `qr`, `qrCaption` · slot: `## title` |

Example — an `agenda` slide:

```markdown
---
layout: agenda
kicker: Agenda
items:
  - no: "01"
    title: 项目背景
    desc: 为什么现在重构
  - no: "02"
    title: 架构与实现
    desc: 链路、组件与关键代码
---
```

Example — a full-width chart and a chart beside text:

```markdown
---
layout: chart
type: bar
meta: 日均成本 · 元
note: 迁移后四条线全部下降
---

## 四条业务线的成本变化

---
layout: image-left
kicker: Cost Split
bullets:
  - 存储仍占 42%，主要来自双跑期间保留的旧表
---

## 成本构成

::image::

<CDChart type="pie" />
```

## Components

Registered globally — use them in any slide without importing.

- **`<CDKicker text="Agenda" />`** — crimson square + monospaced, letter-spaced
  eyebrow label. Also accepts a default slot.
- **`<CDChart type="…" />`** — themed ECharts wrapper. The theme *styling* is
  built in; the *data* is yours to pass, so charts are reusable across decks.
  Types: `bar`, `line`, `scatter`, `heatmap`, `sankey` (full-width via the
  `chart` layout) and `pie`, `radar`, `funnel` (in an `image-left` /
  `image-right` `::image::` slot). The host element must have a height.
- **`<CDPageNumber />`** — bottom-right page number (reads the current page).

### Passing chart data

Both ways are optional — every chart falls back to built-in sample data.

Via the `chart` layout's frontmatter (full-width charts); the layout forwards
the data props to `CDChart`:

```yaml
---
layout: chart
type: bar
categories: [订单 GMV, 流量归因, 库存快照]
series:
  - { name: 迁移前, data: [4980, 4340, 2480] }
  - { name: 迁移后, data: [1840, 2260, 720] }
---
```

Or directly on `<CDChart>` (e.g. inside an `::image::` slot):

```html
<CDChart type="pie" :data="[{ name: '存储', value: 42 }, { name: '计算', value: 27 }]" />
<CDChart type="sankey" :nodes="[…]" :links="[…]" />
```

Per-type data props (each falls back to sample data when omitted):

| Type | Data props |
| --- | --- |
| `bar` / `line` | `categories`, `series: [{ name, data, dashed?, area? }]` |
| `scatter` | `series: [{ data: [[x,y], …], color? }]` |
| `pie` / `funnel` | `data: [{ name, value, color? }]` |
| `radar` | `indicator: [{ name, max }]`, `series: [{ name, value: number[] }]` |
| `sankey` | `nodes: [{ name, color? }]`, `links: [{ source, target, value }]` |
| `heatmap` | `categories` (x), `yCategories` (y), `data: [[x,y,v], …]` |

For anything else, pass a full/partial ECharts `:option` (deep-merged over the
themed preset).

## Icons

Layouts render [Lucide](https://lucide.dev) icons via UnoCSS classes like
`i-lucide-git-branch`. Because these names are dynamic, they can't be discovered
by static analysis, so [`uno.config.ts`](./uno.config.ts) safelists the icons the
demo uses plus common ones. **If you reference another lucide icon, add its
`i-lucide-<name>` to the safelist** (or write the static class directly).

## Contributing

- `pnpm install`
- `pnpm dev` — start the `example.md` preview
- Edit `example.md`, `layouts/*`, `styles/*` and watch changes live
- `pnpm build` — build the demo as a static SPA
- `pnpm export` / `pnpm screenshot` — export PDF / PNGs

Learn more about writing themes: <https://sli.dev/guide/write-theme>
