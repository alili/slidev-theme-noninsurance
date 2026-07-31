<script setup lang="ts">
// Quote — surface-background pull quote, vertically centered, with an oversized
// crimson opening quotation mark and an optional attribution rule + author.
// Frontmatter: author. Slot: <p> quote text.
defineProps<{
  author?: string
}>()
</script>

<template>
  <div class="slidev-layout cd-quote">
    <div class="cd-quote__mark">&ldquo;</div>
    <slot />
    <div v-if="author" class="cd-quote__attribution">
      <span class="cd-quote__rule" />
      <span class="cd-quote__author">{{ author }}</span>
    </div>
  </div>
</template>

<style scoped>
.cd-quote {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--cd-pad-top) 200px var(--cd-pad-bottom);
  background: var(--cd-surface);
  color: var(--cd-fg);
  font-family: var(--cd-font-sans);
  box-sizing: border-box;
  overflow: hidden;
}
.cd-quote__mark {
  font-family: var(--cd-font-mono);
  font-size: 120px;
  line-height: 0.7;
  color: var(--cd-accent);
}
/* Default slot: the quotation, authored as a markdown paragraph. */
.cd-quote :deep(p) {
  margin: 32px 0 0;
  font-size: 56px;
  font-weight: 300;
  line-height: 1.45;
  text-wrap: pretty;
}
.cd-quote__attribution {
  margin-top: 56px;
  display: flex;
  align-items: center;
  gap: 24px;
}
.cd-quote__rule {
  display: block;
  width: 56px;
  height: 2px;
  background: var(--cd-accent);
}
.cd-quote__author {
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
}
</style>
