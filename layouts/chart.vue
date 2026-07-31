<script setup lang="ts">
// Chart — full-width chart page. A two-end title bar (h2 + muted mono meta) sits
// above a full-height CDChart, with a small muted note beneath it. Use for
// bar / line / scatter / heatmap / sankey and other wide charts; for pie / radar
// / funnel (chart + text, side-by-side) use image-left / image-right instead,
// placing the CDChart in the image slot.
// Frontmatter: type (chart kind → CDChart), meta? (top-right mono micro), note? (below chart).
// Title: the `title` prop, or an <h2> written in the default slot markdown.
withDefaults(
  defineProps<{
    type?: string
    title?: string
    meta?: string
    note?: string
  }>(),
  {
    type: 'bar',
    meta: '日均成本 · 元',
    note: '迁移后四条线全部下降，库存快照降幅最大',
  },
)
</script>

<template>
  <div class="slidev-layout cd-chart">
    <div class="cd-chart__head">
      <h2 v-if="title" class="cd-chart__title">{{ title }}</h2>
      <slot v-else>
        <h2 class="cd-chart__title">四条业务线的成本变化</h2>
      </slot>
      <span v-if="meta" class="cd-chart__meta">{{ meta }}</span>
    </div>

    <div class="cd-chart__canvas">
      <CDChart :type="type" />
    </div>

    <p v-if="note" class="cd-chart__note">{{ note }}</p>

    <CDPageNumber />
  </div>
</template>

<style scoped>
.cd-chart {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* header bar: title left, muted mono meta right, both bottom-aligned */
.cd-chart__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
}
.cd-chart__title,
.cd-chart__head :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-chart__meta {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
  white-space: nowrap;
}

/* chart canvas: fills the remaining height — CDChart renders at 100% of this box */
.cd-chart__canvas {
  flex: 1;
  min-height: 0;
}

/* caption under the chart */
.cd-chart__note {
  margin: 28px 0 0;
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
}
</style>
