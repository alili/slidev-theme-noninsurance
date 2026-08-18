<script setup lang="ts">
// Image grid — an h2 heading over a 3-column, equal-height grid. Each cell is a
// surface "screenshot" tile (a real <img> when `src` is set, otherwise a dashed
// "模块截图 0N" placeholder) with a small title + micro muted caption underneath.
// Mirrors the original "图片网格 / 09" section of Crimson Deck.
//
// Frontmatter: images[] (structured). Heading via the `title` prop OR a markdown
// `## …` in the slot (styled the same). The page number comes from the theme footer.

import { useSlideTitle } from '../composables/useSlideTitle'

interface ImageItem {
  /** Screenshot path; omit to render the "模块截图 0N" placeholder tile. */
  src?: string
  /** Caption title (small, weight 500). */
  title: string
  /** Caption description (micro, muted). */
  desc?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
    frontmatter?: Record<string, any>
    images?: ImageItem[]
  }>(),
  {
    images: () => [
      { title: '任务编排', desc: 'DAG 可视化与重跑' },
      { title: '质量监控', desc: '规则库与告警分级' },
      { title: '成本看板', desc: '按团队拆分账单' },
    ],
  },
)

const heading = useSlideTitle(props)

// 1-based, zero-padded index for the "模块截图 0N" placeholder label.
const pad = (i: number) => String(i + 1).padStart(2, '0')
</script>

<template>
  <div class="slidev-layout cd-image-grid">
    <h2 v-if="heading" class="cd-image-grid__heading">{{ heading }}</h2>
    <slot />

    <div class="cd-image-grid__grid">
      <div
        v-for="(item, i) in images"
        :key="i"
        class="cd-image-grid__cell"
      >
        <div class="cd-image-grid__media">
          <img
            v-if="item.src"
            class="cd-image-grid__img"
            :src="item.src"
            :alt="item.title"
          />
          <div v-else class="cd-image-grid__placeholder">模块截图 {{ pad(i) }}</div>
        </div>
        <div class="cd-image-grid__caption">
          <span class="cd-image-grid__name">{{ item.title }}</span>
          <span v-if="item.desc" class="cd-image-grid__desc">{{ item.desc }}</span>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.cd-image-grid {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* heading — from the `title` prop … */
.cd-image-grid__heading {
  margin: 0 0 40px;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* … or a markdown `#` / `##` written in the slot */
.cd-image-grid :deep(h1),
.cd-image-grid :deep(h2) {
  margin: 0 0 40px;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* optional intro copy written in the slot */
.cd-image-grid :deep(p) {
  margin: 0 0 32px;
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
  max-width: 1300px;
}
.cd-image-grid :deep(ul),
.cd-image-grid :deep(ol) {
  margin: 0 0 32px;
  padding-left: 1.4em;
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
}

/* 3-column equal-height grid */
.cd-image-grid__grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
}
.cd-image-grid__cell {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-height: 0;
}

/* image tile — real screenshot or dashed placeholder */
.cd-image-grid__media {
  flex: 1;
  position: relative;
  min-height: 0;
  background: var(--cd-surface);
}
.cd-image-grid__img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.cd-image-grid__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
  outline: 1px dashed var(--cd-line);
  outline-offset: -1px;
}

/* caption */
.cd-image-grid__caption {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cd-image-grid__name {
  font-size: var(--cd-type-small);
  font-weight: 500;
}
.cd-image-grid__desc {
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
</style>
