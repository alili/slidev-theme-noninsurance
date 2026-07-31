<script setup lang="ts">
// Code + explanation — two-column grid (left 1.15fr / right 1fr).
// Left: a crimson-topped surface panel with a mono file label and a ::code::
//   slot (write a yml/py fenced block; Shiki renders it on the panel surface,
//   the global code container is stripped so it reads as plain text).
// Right: CDKicker + <h2> (default slot) + a field-reference list from `items`.
// Frontmatter: file, kicker, items:{key,desc}[]. Named slot: ::code::. Default slot: <h2>.
interface CDCodeField {
  key: string
  desc: string
}
withDefaults(
  defineProps<{
    file?: string
    kicker?: string
    items?: CDCodeField[]
  }>(),
  {
    file: 'metrics/shop_gmv.yml',
    kicker: 'Semantic Layer',
    items: () => [
      { key: 'grain', desc: '明确聚合粒度，避免下游重复口径' },
      { key: 'freshness_sla', desc: '超时自动告警到 Owner 群' },
      { key: 'tests', desc: '每次发布前跑一遍，失败即阻断合并' },
    ],
  },
)
</script>

<template>
  <div class="slidev-layout cd-code-cols">
    <div class="cd-code-cols__panel">
      <span class="cd-code-cols__file">{{ file }}</span>
      <div class="cd-code-cols__code">
        <slot name="code">
          <span class="cd-code-cols__code-empty">在 ::code:: 中写 yml / py 围栏代码</span>
        </slot>
      </div>
    </div>
    <div class="cd-code-cols__aside">
      <CDKicker v-if="kicker" :text="kicker" class="cd-code-cols__kicker" />
      <div class="cd-code-cols__title">
        <slot />
      </div>
      <div v-if="items && items.length" class="cd-code-cols__items">
        <div v-for="item in items" :key="item.key" class="cd-code-cols__item">
          <span class="cd-code-cols__key">{{ item.key }}</span>
          <span class="cd-code-cols__desc">{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-code-cols {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  grid-template-rows: 100%;
}

/* ---- left: code panel -------------------------------------------------- */
.cd-code-cols__panel {
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: var(--cd-pad-top) 56px var(--cd-pad-bottom);
  background: var(--cd-surface);
  border-top: 3px solid var(--cd-accent);
}
.cd-code-cols__file {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
.cd-code-cols__code {
  min-width: 0;
  overflow-x: auto;
}
.cd-code-cols__code-empty {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-code);
  color: var(--cd-muted);
}
/* The fence sits on the panel surface: strip the global code container's
   border / background / padding and match the design's 1.75 leading. */
.cd-code-cols__code :deep(pre),
.cd-code-cols__code :deep(.slidev-code) {
  margin: 0;
  padding: 0;
  background: transparent !important;
  border-top: none;
  border-radius: 0;
  line-height: 1.75;
}
.cd-code-cols__code :deep(.slidev-code-wrapper) {
  margin: 0;
}

/* ---- right: explanation ------------------------------------------------ */
.cd-code-cols__aside {
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom) 72px;
}
.cd-code-cols__kicker {
  margin-bottom: 32px;
}
.cd-code-cols__title :deep(h2) {
  margin: 0 0 var(--cd-gap-title);
  font-size: 58px;
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: -0.02em;
}
.cd-code-cols__title :deep(p) {
  margin: 0 0 var(--cd-gap-title);
  font-size: var(--cd-type-small);
  line-height: 1.5;
  color: var(--cd-muted);
}
.cd-code-cols__items {
  display: flex;
  flex-direction: column;
  gap: 36px;
}
.cd-code-cols__item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid var(--cd-line);
  padding-top: 20px;
}
.cd-code-cols__key {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-accent);
}
.cd-code-cols__desc {
  font-size: var(--cd-type-small);
  line-height: 1.5;
  color: var(--cd-muted);
}
</style>
