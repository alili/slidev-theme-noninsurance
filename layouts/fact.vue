<script setup lang="ts">
// Fact — full-accent emphasis / demo-cue slide. A single lucide icon sits above
// an oversized title and a short supporting note, centered on both axes. Meant
// for "现场演示 / Demo 提示" style transition pages.
// Frontmatter: icon (lucide name; default "monitor-play", pass "" to hide it).
// Slot: <h2> big title + <p> supporting note.
withDefaults(
  defineProps<{
    icon?: string
  }>(),
  { icon: 'monitor-play' },
)
</script>

<template>
  <div class="slidev-layout cd-fact">
    <div
      v-if="icon"
      :class="`i-lucide-${icon}`"
      style="width: 96px; height: 96px; color: #08080a; opacity: 0.95"
    />
    <div class="cd-fact__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cd-fact {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
  background: var(--cd-accent);
  color: #08080a !important;
}
.cd-fact * {
  color: #08080a !important;
}
.cd-fact__body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
/* Big title — user writes `## …` (h2); h1 styled the same for safety. */
.cd-fact__body :deep(h1),
.cd-fact__body :deep(h2) {
  margin: 44px 0 0;
  font-size: 110px;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #08080a !important;
}
/* Supporting note. */
.cd-fact__body :deep(p) {
  margin: 28px 0 0;
  max-width: 1150px;
  font-size: var(--cd-type-body);
  color: #08080a !important;
  opacity: 0.88;
}
</style>
