<script setup lang="ts">
// Logos — partner / client logo wall. A title (h2) with a muted subtitle,
// then a 3×2 surface grid. Each cell shows a contained <img> when `src` is
// given, otherwise a dashed placeholder labelled by `name` (or "Logo 0N").
// Frontmatter: title, subtitle, logos[]. The title/subtitle may instead be
// written as markdown (h2 + p) — both flow through the same :deep styles.

import { useSlideTitle } from '../composables/useSlideTitle'

interface CDLogo {
  /** Image path. When omitted the cell renders a dashed placeholder. */
  src?: string
  /** Label for the placeholder / img alt (falls back to "Logo 0N"). */
  name?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
    frontmatter?: Record<string, any>
    subtitle?: string
    logos?: CDLogo[]
  }>(),
  {
    // Six empty slots keep the 3×2 grid visible when no data is passed yet.
    logos: () => [{}, {}, {}, {}, {}, {}],
  },
)

const heading = useSlideTitle(props)

const placeholderLabel = (i: number) => `Logo ${String(i + 1).padStart(2, '0')}`
</script>

<template>
  <div class="slidev-layout cd-logos">
    <h2 v-if="heading">{{ heading }}</h2>
    <slot />
    <p v-if="subtitle">{{ subtitle }}</p>

    <div class="cd-logos__grid">
      <div v-for="(logo, i) in logos" :key="i" class="cd-logos__cell">
        <img
          v-if="logo.src"
          class="cd-logos__img"
          :src="logo.src"
          :alt="logo.name || placeholderLabel(i)"
        />
        <div v-else class="cd-logos__ph">{{ logo.name || placeholderLabel(i) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-logos {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
  overflow: hidden;
}

/* Header — rendered from props here, and shared with any markdown the user
   writes into the slot (both are matched by these :deep selectors). */
.cd-logos :deep(h1),
.cd-logos :deep(h2) {
  margin: 0 0 20px;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-logos :deep(p) {
  margin: 0 0 56px;
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
}
.cd-logos :deep(ul) {
  margin: 0 0 56px;
  padding-left: 1.4em;
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
}
.cd-logos :deep(li) {
  margin: 0 0 var(--cd-gap-item);
}
.cd-logos :deep(strong) {
  color: var(--cd-accent);
}

.cd-logos__grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 28px;
}
.cd-logos__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 0;
  padding: 36px;
  overflow: hidden;
  box-sizing: border-box;
  background: var(--cd-surface);
}
.cd-logos__img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.cd-logos__ph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
  outline: 1px dashed var(--cd-line);
}
</style>
