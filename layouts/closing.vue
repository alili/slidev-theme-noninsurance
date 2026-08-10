<script setup lang="ts">
// Closing — bottom-aligned decision recap with a bottom-left crimson glow.
// Frontmatter: items[], footLeft, footRight. Slot: <h2> title (weight 900).
defineProps<{
  items?: string[]
  footLeft?: string
  footRight?: string
}>()
</script>

<template>
  <div class="slidev-layout cd-closing">
    <div class="cd-closing__glow" />
    <div class="cd-closing__body">
      <slot />
      <div v-if="items && items.length" class="cd-closing__items">
        <p v-for="(item, i) in items" :key="i" class="cd-closing__item">{{ item }}</p>
      </div>
    </div>
    <div v-if="footLeft || footRight" class="cd-closing__foot">
      <span>{{ footLeft }}</span>
      <span>{{ footRight }}</span>
    </div>
  </div>
</template>

<style scoped>
.cd-closing {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}
.cd-closing__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(60% 80% at 12% 88%, rgba(var(--cd-accent-rgb), 0.34) 0%, rgba(var(--cd-accent-rgb), 0.06) 45%, transparent 72%);
}
.cd-closing__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.cd-closing__body :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 900;
  letter-spacing: -0.02em;
}
.cd-closing__items {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  max-width: 1500px;
}
.cd-closing__item {
  margin: 0;
  font-size: var(--cd-type-body);
  line-height: 1.6;
  color: var(--cd-muted);
}
.cd-closing__foot {
  position: relative;
  margin-top: 72px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--cd-line);
  padding-top: 28px;
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
</style>
