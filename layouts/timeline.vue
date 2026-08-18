<script setup lang="ts">
// Timeline — a vertically-centered horizontal timeline: one title, an adaptive
// rail line, and a row of node columns (square marker + monospaced time +
// stage title + description). Solid crimson marks a finished stage; an outlined
// muted marker marks a stage still ahead; active stage gets an accent glow.
// Frontmatter: title? (or write heading as markdown `##`), items[], cols?, gap?, dense?.
// Slot: <h2> heading (+ optional lead <p>).
import { computed } from 'vue'
import { useSlideTitle } from '../composables/useSlideTitle'

export interface TimelineItem {
  /** Time or phase label (e.g. "2025 Q4", "Stage 01", "2026-03") */
  time?: string
  phase?: string
  date?: string
  step?: string
  /** Stage headline */
  title?: string
  name?: string
  label?: string
  /** Optional supporting description */
  desc?: string
  description?: string
  text?: string
  /** Milestone completed */
  done?: boolean
  completed?: boolean
  /** Milestone currently active / in-progress */
  active?: boolean
  /** Status string: 'done' | 'active' | 'pending' | 'todo' */
  status?: 'done' | 'active' | 'pending' | 'todo' | string
}

export interface Props {
  title?: string
  /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
  frontmatter?: Record<string, any>
  items?: TimelineItem[]
  /** Explicit column count override (default: auto = items.length) */
  cols?: number | string
  /** Custom gap between columns (e.g. '40px', '2rem') */
  gap?: string | number
  /** Compact density mode */
  dense?: boolean
}

const defaultItems: TimelineItem[] = [
  { time: '2025 Q4', title: '立项与架构评审', desc: '确定流式方案与迁移边界', done: true },
  { time: '2026 Q1', title: '首条链路上线', desc: '订单 GMV 双跑两个月', done: true },
  { time: '2026 Q2', title: '语义层与质量规则', desc: '口径收敛，告警接入值班', done: true },
  { time: '2026 Q3', title: '全量迁移收尾', desc: '下线遗留脚本与旧集群', done: false },
]

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { time: '2025 Q4', title: '立项与架构评审', desc: '确定流式方案与迁移边界', done: true },
    { time: '2026 Q1', title: '首条链路上线', desc: '订单 GMV 双跑两个月', done: true },
    { time: '2026 Q2', title: '语义层与质量规则', desc: '口径收敛，告警接入值班', done: true },
    { time: '2026 Q3', title: '全量迁移收尾', desc: '下线遗留脚本与旧集群', done: false },
  ],
})

const heading = useSlideTitle(props)

// Normalized items with field fallbacks
const normalizedItems = computed(() => {
  const list = props.items && props.items.length > 0 ? props.items : defaultItems
  return list.map((item, idx) => {
    const isDone = item.done === true || item.completed === true || item.status === 'done'
    const isActive = item.active === true || item.status === 'active' || item.status === 'current'
    const time = item.time ?? item.phase ?? item.date ?? item.step ?? ''
    const title = item.title ?? item.name ?? item.label ?? ''
    const desc = item.desc ?? item.description ?? item.text ?? ''
    return {
      ...item,
      time,
      title,
      desc,
      isDone,
      isActive,
      index: idx,
    }
  })
})

const itemCount = computed(() => normalizedItems.value.length)

const columnCount = computed(() => {
  if (props.cols) {
    const parsed = Number(props.cols)
    if (!Number.isNaN(parsed) && parsed > 0)
      return parsed
  }
  return Math.max(1, itemCount.value)
})

// Calculate dynamic rail background gradient according to done/active status & step count
const railGradient = computed(() => {
  const count = columnCount.value
  const items = normalizedItems.value
  if (count <= 1) {
    return items[0]?.isDone
      ? 'var(--cd-accent)'
      : 'var(--cd-line)'
  }

  // Find the last done or active index
  let lastActiveOrDoneIndex = -1
  let isLastActiveOnly = false
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].isDone) {
      lastActiveOrDoneIndex = i
      break
    }
    else if (items[i].isActive && lastActiveOrDoneIndex === -1) {
      lastActiveOrDoneIndex = i
      isLastActiveOnly = true
    }
  }

  if (lastActiveOrDoneIndex < 0) {
    return 'var(--cd-line)'
  }

  if (lastActiveOrDoneIndex >= count - 1 && !isLastActiveOnly) {
    return 'var(--cd-accent)'
  }

  // When node k is done (0 <= k < count - 1):
  // Dot k is at column k. The connection between dot k and dot k+1 is (k + 0.8) / count * 100%
  // In a 4-item list with 3 done (index 0, 1, 2 done, k=2):
  // ((2 + 0.8) / 4) * 100% = 70% (matches the exact design stop from the Crimson Deck)
  const factor = isLastActiveOnly ? 0.3 : 0.8
  const activePercent = Math.min(100, Math.max(0, ((lastActiveOrDoneIndex + factor) / count) * 100))
  const formatted = Math.round(activePercent * 10) / 10

  return `linear-gradient(90deg, var(--cd-accent) 0%, var(--cd-accent) ${formatted}%, var(--cd-line) ${formatted}%)`
})

// Density tier for typography and gap scaling
const densityTier = computed(() => {
  if (props.dense)
    return 'dense'
  const c = columnCount.value
  if (c <= 3)
    return 'spacious'
  if (c === 4)
    return 'standard'
  if (c === 5)
    return 'moderate'
  if (c === 6)
    return 'compact'
  return 'dense'
})

// Dynamic gap if not explicitly provided
const computedGap = computed(() => {
  if (props.gap !== undefined) {
    return typeof props.gap === 'number' ? `${props.gap}px` : props.gap
  }
  const c = columnCount.value
  if (c <= 3)
    return '56px'
  if (c === 4)
    return '48px'
  if (c === 5)
    return '36px'
  if (c === 6)
    return '28px'
  return '20px'
})
</script>

<template>
  <div class="slidev-layout cd-timeline" :class="`cd-timeline--${densityTier}`">
    <div class="cd-timeline__head">
      <h2 v-if="heading" class="cd-timeline__title">
        {{ heading }}
      </h2>
      <slot />
    </div>

    <div
      class="cd-timeline__track"
      :style="{
        '--timeline-cols': columnCount,
        '--timeline-gap': computedGap,
        '--timeline-rail-bg': railGradient,
      }"
    >
      <div class="cd-timeline__rail" />
      <div
        v-for="(item, i) in normalizedItems"
        :key="i"
        class="cd-timeline__node"
        :class="{
          'is-done': item.isDone,
          'is-active': item.isActive,
        }"
      >
        <span class="cd-timeline__dot" />
        <span class="cd-timeline__time">{{ item.time }}</span>
        <span class="cd-timeline__label">{{ item.title }}</span>
        <span v-if="item.desc" class="cd-timeline__desc">{{ item.desc }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-timeline {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* ---- heading: markdown `##` slot, or the `title` prop ------------------- */
.cd-timeline__head {
  margin-bottom: 84px;
}
.cd-timeline__head:has(p) {
  margin-bottom: 56px;
}
.cd-timeline__title,
.cd-timeline :deep(h1),
.cd-timeline :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-timeline :deep(p) {
  margin: 20px 0 0;
  font-size: var(--cd-type-body);
  font-weight: 300;
  line-height: 1.55;
  color: var(--cd-muted);
  max-width: 1150px;
}
.cd-timeline :deep(ul) {
  margin: 20px 0 0;
  padding-left: 1.4em;
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
}

/* ---- horizontal track: rail line + adaptive node columns --------------- */
.cd-timeline__track {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--timeline-cols, 4), minmax(0, 1fr));
  gap: var(--timeline-gap, 48px);
  align-items: start;
}
.cd-timeline__rail {
  position: absolute;
  left: 0;
  right: 0;
  top: 9px;
  height: 2px;
  background: var(--timeline-rail-bg, linear-gradient(90deg, var(--cd-accent) 0%, var(--cd-accent) 70%, var(--cd-line) 70%));
  pointer-events: none;
}
.cd-timeline__node {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
}

/* ---- node marker: outlined by default, solid crimson once done --------- */
.cd-timeline__dot {
  display: block;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  background: var(--cd-surface-2);
  border: 2px solid var(--cd-line);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}
.cd-timeline__node.is-done .cd-timeline__dot {
  background: var(--cd-accent);
  border: none;
}
.cd-timeline__node.is-active .cd-timeline__dot {
  background: var(--cd-surface);
  border: 2px solid var(--cd-accent);
  box-shadow: 0 0 0 4px var(--cd-accent-soft);
}

/* ---- node text --------------------------------------------------------- */
.cd-timeline__time {
  font-family: var(--cd-font-mono);
  font-size: var(--timeline-time-size, var(--cd-type-body));
  color: var(--cd-muted);
  line-height: 1.2;
}
.cd-timeline__node.is-done .cd-timeline__time,
.cd-timeline__node.is-active .cd-timeline__time {
  color: var(--cd-accent);
}
.cd-timeline__label {
  font-size: var(--timeline-title-size, var(--cd-type-small));
  line-height: 1.4;
  font-weight: 500;
  word-break: break-word;
}
.cd-timeline__node.is-active .cd-timeline__label {
  color: var(--cd-fg);
  font-weight: 600;
}
.cd-timeline__desc {
  font-size: var(--timeline-desc-size, var(--cd-type-micro));
  line-height: 1.5;
  color: var(--cd-muted);
  word-break: break-word;
}

/* ---- density scaling tiers --------------------------------------------- */
.cd-timeline--spacious {
  --timeline-time-size: var(--cd-type-body);
  --timeline-title-size: var(--cd-type-subtitle);
  --timeline-desc-size: var(--cd-type-small);
}
.cd-timeline--standard {
  --timeline-time-size: var(--cd-type-body);
  --timeline-title-size: var(--cd-type-small);
  --timeline-desc-size: var(--cd-type-micro);
}
.cd-timeline--moderate {
  --timeline-time-size: calc(var(--cd-type-body) * 0.9);
  --timeline-title-size: calc(var(--cd-type-small) * 0.95);
  --timeline-desc-size: calc(var(--cd-type-micro) * 0.92);
}
.cd-timeline--compact {
  --timeline-time-size: calc(var(--cd-type-body) * 0.8);
  --timeline-title-size: calc(var(--cd-type-small) * 0.88);
  --timeline-desc-size: calc(var(--cd-type-micro) * 0.85);
}
.cd-timeline--dense {
  --timeline-time-size: calc(var(--cd-type-body) * 0.72);
  --timeline-title-size: calc(var(--cd-type-small) * 0.8);
  --timeline-desc-size: calc(var(--cd-type-micro) * 0.78);
}
</style>
