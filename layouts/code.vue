<script setup lang="ts">
// Code — full-screen code slide. A justified title bar (h2 + monospaced
// filename) sits over a surface panel that fills the rest of the canvas.
// The panel's look (surface fill, crimson top border, padding) is provided by
// styles/code.css via `.slidev-layout pre`; this layout only stretches the
// slotted <pre> to fill the remaining height — it never restates the code bg.
// Frontmatter: title, file. Default slot: a fenced code block (```py / ```ts …).
defineProps<{
  title?: string
  file?: string
}>()
</script>

<template>
  <div class="slidev-layout cd-code">
    <div v-if="title || file" class="cd-code__bar">
      <h2 v-if="title" class="cd-code__title">{{ title }}</h2>
      <span v-if="file" class="cd-code__file">{{ file }}</span>
    </div>
    <div class="cd-code__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cd-code {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}
.cd-code__bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
}
.cd-code__title {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-code__file {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
.cd-code__body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* Stretch the user's fenced code (rendered as <pre>) to fill the panel.
   Surface fill, crimson top border and padding are inherited from
   styles/code.css — do not restate the background here. */
.cd-code :deep(pre) {
  flex: 1;
  min-height: 0;
  margin: 0;
  overflow: auto;
}
</style>
