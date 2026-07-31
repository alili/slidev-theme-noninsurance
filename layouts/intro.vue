<script setup lang="ts">
// Intro — centered big title + lead paragraph. Slot: <h1> + <p>.
</script>

<template>
  <div class="slidev-layout cd-intro">
    <div class="cd-intro__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cd-intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}
.cd-intro__body :deep(h1) {
  margin: 0 0 0.3em;
  font-size: var(--cd-type-title);
  font-weight: 900;
  line-height: 1.06;
  letter-spacing: -0.02em;
}
.cd-intro__body :deep(p) {
  margin: 0;
  font-size: var(--cd-type-subtitle);
  font-weight: 300;
  color: var(--cd-muted);
  max-width: 1150px;
}
</style>
