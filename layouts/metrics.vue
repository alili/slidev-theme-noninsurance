<script setup lang="ts">
// Metrics — a title over a row of equal-height stat cards (crimson top border).
// Frontmatter: `title` (or an <h2> in the slot) + `items[]`. Slot: <h2> title.
import { useSlideTitle } from '../composables/useSlideTitle'

interface MetricItem {
  value: string
  unit?: string
  label: string
  note?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
    frontmatter?: Record<string, any>
    items?: MetricItem[]
  }>(),
  {
    items: () => [
      { value: '-63', unit: '%', label: '端到端延迟', note: '18h → 6.7h（P95）' },
      { value: '-41', unit: '%', label: '单位存算成本', note: '按每 TB 处理量折算' },
      { value: '99.4', unit: '%', label: '任务成功率', note: '连续 12 周未出现 P1' },
    ],
  },
)

const heading = useSlideTitle(props)
</script>

<template>
  <div class="slidev-layout cd-metrics">
    <div class="cd-metrics__head">
      <h2 v-if="heading" class="cd-metrics__title">{{ heading }}</h2>
      <slot v-else>
        <h2 class="cd-metrics__title">重构半年后的三个变化</h2>
      </slot>
    </div>
    <div class="cd-metrics__grid">
      <div v-for="(item, i) in items" :key="i" class="cd-metrics__card">
        <span class="cd-metrics__value">{{ item.value }}<span v-if="item.unit" class="cd-metrics__unit">{{ item.unit }}</span></span>
        <div class="cd-metrics__meta">
          <span class="cd-metrics__label">{{ item.label }}</span>
          <span v-if="item.note" class="cd-metrics__note">{{ item.note }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-metrics {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* title — supplied via the `title` prop or an <h2> in the slot markdown */
.cd-metrics__head {
  margin-bottom: var(--cd-gap-title);
}
.cd-metrics__title,
.cd-metrics__head :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-metrics__head :deep(p) {
  margin: 16px 0 0;
  font-size: var(--cd-type-body);
  line-height: 1.5;
  color: var(--cd-muted);
  max-width: 1200px;
}

/* equal-height stat cards — flex row so any number of items stays balanced */
.cd-metrics__grid {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 32px;
}
.cd-metrics__card {
  flex: 1;
  min-width: 0;
  background: var(--cd-surface);
  border-top: 3px solid var(--cd-accent);
  padding: 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cd-metrics__value {
  font-family: var(--cd-font-mono);
  font-size: 150px;
  font-weight: 700;
  line-height: 0.9;
  color: var(--cd-accent);
}
.cd-metrics__unit {
  font-size: 56px;
}
.cd-metrics__meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cd-metrics__label {
  font-size: var(--cd-type-subtitle);
  font-weight: 500;
}
.cd-metrics__note {
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
</style>
