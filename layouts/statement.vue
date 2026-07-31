<script setup lang="ts">
// Statement — a single-line core claim, vertically centered on the dark canvas
// with an 8px crimson rule running the full left edge. Optional supporting
// points sit in a 3-column footer beneath a hairline.
// Frontmatter: points[] ({ no, text }).
// Slot: <p> the claim — wrap the key phrase in **…** or _…_ to accent it.
interface StatementPoint {
  /** monospace ordinal shown above the line, e.g. "01" */
  no: string
  /** short supporting sentence */
  text: string
}

withDefaults(
  defineProps<{
    points?: StatementPoint[]
  }>(),
  {
    points: () => [
      { no: '01', text: '大促期间人工补数 平均每周 6 次' },
      { no: '02', text: '口径分散在 4 套脚本，无法审计' },
      { no: '03', text: '存算耦合，扩容只能整集群加机器' },
    ],
  },
)
</script>

<template>
  <div class="slidev-layout cd-statement">
    <div class="cd-statement__accent" />
    <slot />
    <div v-if="points && points.length" class="cd-statement__points">
      <div v-for="(point, i) in points" :key="i" class="cd-statement__point">
        <span class="cd-statement__point-no">{{ point.no }}</span>
        <span class="cd-statement__point-text">{{ point.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-statement {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* full-height crimson rule pinned to the very left edge */
.cd-statement__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: var(--cd-accent);
}

/* the claim — slotted markdown paragraph */
.cd-statement :deep(p) {
  margin: 0;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.3;
  max-width: 1520px;
  text-wrap: pretty;
}
.cd-statement :deep(strong),
.cd-statement :deep(em) {
  color: var(--cd-accent);
  font-weight: 700;
  font-style: normal;
}

/* supporting points */
.cd-statement__points {
  margin-top: 64px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--cd-gap-title);
  border-top: 1px solid var(--cd-line);
  padding-top: 40px;
}
.cd-statement__point {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.cd-statement__point-no {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-accent);
}
.cd-statement__point-text {
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
  line-height: 1.5;
}
</style>
