<script setup lang="ts">
// Section divider — full crimson background, oversized number, title + note.
// Frontmatter: no (e.g. "01"). Slot: <h2> title + <p> description.
defineProps<{ no?: string }>()
</script>

<template>
  <div class="slidev-layout cd-section">
    <div v-if="no" class="cd-section__no">{{ no }}</div>
    <div class="cd-section__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cd-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
  background: var(--cd-accent);
  color: #fff;
}
.cd-section__no {
  font-family: var(--cd-font-mono);
  font-size: 130px;
  font-weight: 700;
  line-height: 1;
  opacity: 0.42;
}
.cd-section__body :deep(h2) {
  margin: 20px 0 0;
  font-size: var(--cd-type-title);
  font-weight: 900;
  letter-spacing: -0.02em;
}
.cd-section__body :deep(p) {
  margin: 24px 0 0;
  font-size: var(--cd-type-body);
  max-width: 1100px;
  opacity: 0.85;
}
</style>
