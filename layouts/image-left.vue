<script setup lang="ts">
// Image-left — two-column grid: a surface media panel on the left (crimson top
// border) and narrative on the right. Frontmatter: image, split, kicker,
// bullets[]. Slots: ::image:: (CDChart / mermaid / plantuml code block) and
// default (<h2> title). Modeled on the original "PlantUML 时序图" section.
import { computed } from 'vue'

interface CDBullet {
  /** bullet copy */
  text: string
  /** optional lucide icon name; replaces the crimson square when set */
  icon?: string
}

const props = withDefaults(
  defineProps<{
    image?: string
    split?: string
    kicker?: string
    bullets?: (string | CDBullet)[]
  }>(),
  { split: '1fr 1fr' },
)

// Sensible sample bullets so the layout is never empty before the user edits it.
const DEFAULT_BULLETS: CDBullet[] = [
  { text: '运营自行选择时间区间，无需提工单' },
  { text: '回放按主键幂等写入，重跑不产生脏数据' },
  { text: '每次回放留下版本号，可回退到任意版本' },
]

const items = computed<CDBullet[]>(() =>
  (props.bullets ?? DEFAULT_BULLETS).map((b) =>
    typeof b === 'string' ? { text: b } : b,
  ),
)
</script>

<template>
  <div class="slidev-layout cd-image-left" :style="{ gridTemplateColumns: split }">
    <!-- media side (left) -->
    <div class="cd-image-left__media">
      <slot name="image">
        <img
          v-if="image"
          :src="image"
          :alt="kicker || 'image'"
          class="cd-image-left__img"
        >
        <div v-else class="cd-image-left__placeholder">PlantUML 时序图</div>
      </slot>
    </div>

    <!-- narrative side (right) -->
    <div class="cd-image-left__text">
      <CDKicker v-if="kicker" :text="kicker" class="cd-image-left__kicker" />
      <div class="cd-image-left__body">
        <slot />
      </div>
      <ul v-if="items.length" class="cd-image-left__bullets">
        <li v-for="(b, i) in items" :key="i" class="cd-image-left__bullet">
          <div
            v-if="b.icon"
            class="cd-image-left__bullet-icon"
            :class="`i-lucide-${b.icon}`"
            style="width: 24px; height: 24px; color: var(--cd-accent)"
          />
          <span v-else class="cd-image-left__square" />
          <span class="cd-image-left__bullet-text">{{ b.text }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.cd-image-left {
  display: grid;
  grid-template-rows: minmax(0, 1fr);
}

/* ---- media side (left) ------------------------------------------------- */
.cd-image-left__media {
  position: relative;
  min-width: 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  /* Bottom uses the shared token so the visual clears the slide footer. */
  padding: 56px 56px var(--cd-pad-bottom);
  overflow: hidden;
  background: var(--cd-surface);
  border-top: 3px solid var(--cd-accent);
}
.cd-image-left__img {
  width: 100%;
  height: auto;
  max-height: 100%;
  object-fit: contain;
}
.cd-image-left__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--cd-surface);
  outline: 1px dashed var(--cd-line);
  color: var(--cd-muted);
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-small);
}

/* ---- narrative side (right) -------------------------------------------- */
.cd-image-left__text {
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom) 72px;
}
.cd-image-left__kicker {
  margin-bottom: 28px;
}
.cd-image-left__body :deep(h1),
.cd-image-left__body :deep(h2) {
  margin: 0 0 32px;
  font-size: 58px;
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: -0.02em;
}
.cd-image-left__body :deep(p) {
  margin: 0 0 22px;
  font-size: var(--cd-type-small);
  line-height: 1.55;
  color: var(--cd-muted);
}
.cd-image-left__body :deep(ul) {
  margin: 0;
  padding-left: 1.2em;
  font-size: var(--cd-type-small);
  line-height: 1.55;
  color: var(--cd-muted);
}

/* ---- crimson-dot bullets ----------------------------------------------- */
.cd-image-left__bullets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.cd-image-left__bullet {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.cd-image-left__square {
  width: 10px;
  height: 10px;
  margin-top: 15px;
  flex: none;
  display: block;
  background: var(--cd-accent);
}
.cd-image-left__bullet-icon {
  margin-top: 8px;
  flex: none;
}
.cd-image-left__bullet-text {
  font-size: var(--cd-type-small);
  line-height: 1.55;
  color: var(--cd-muted);
}
</style>
