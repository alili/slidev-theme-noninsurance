<script setup lang="ts">
// Image-full — full-bleed hero image with a left→right dark scrim and a
// bottom-left caption (kicker + title + desc).
//
// Frontmatter (structured props): image (path), kicker, title, desc.
//   - image present  → <img> object-fit: cover
//   - image absent   → dashed placeholder box on --cd-surface
// Default slot: overrides the caption text (title/desc) with custom markdown
//   (h1/h2/p/ul). The kicker always comes from the `kicker` prop.
defineProps<{
  image?: string
  kicker?: string
  title?: string
  desc?: string
}>()
</script>

<template>
  <div class="slidev-layout cd-image-full">
    <!-- layer 1: full-bleed media (real image, or a dashed placeholder) -->
    <div class="cd-image-full__media">
      <img v-if="image" :src="image" :alt="title || ''" class="cd-image-full__img">
      <div v-else class="cd-image-full__placeholder">拖入全屏配图 / 1920×1080</div>
    </div>

    <!-- layer 2: left→right dark scrim so the caption stays legible -->
    <div class="cd-image-full__scrim" />

    <!-- layer 3: bottom-left caption; slot overrides title/desc -->
    <div class="cd-image-full__caption">
      <CDKicker v-if="kicker" :text="kicker" />
      <slot>
        <h2 v-if="title">{{ title }}</h2>
        <p v-if="desc">{{ desc }}</p>
      </slot>
    </div>
  </div>
</template>

<style scoped>
/* ---- full-bleed media --------------------------------------------------- */
.cd-image-full__media {
  position: absolute;
  inset: 0;
}
.cd-image-full__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cd-image-full__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--cd-surface);
  color: var(--cd-muted);
  font-size: var(--cd-type-small);
  /* dashed outline pulled inward so it isn't clipped by overflow:hidden */
  outline: 1px dashed var(--cd-line);
  outline-offset: -1px;
}

/* ---- dark scrim (left → right), non-interactive ------------------------- */
.cd-image-full__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    rgba(8, 8, 10, 0.94) 0%,
    rgba(8, 8, 10, 0.72) 42%,
    rgba(8, 8, 10, 0) 72%
  );
}

/* ---- bottom-left caption ------------------------------------------------ */
.cd-image-full__caption {
  position: absolute;
  left: var(--cd-pad-x);
  bottom: var(--cd-pad-bottom);
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  pointer-events: none;
}

/* caption text — covers prop fallback (h2/p) and slot markdown (h1/h2/p/ul) */
.cd-image-full :deep(h1),
.cd-image-full :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
.cd-image-full :deep(p) {
  margin: 0;
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
}
.cd-image-full :deep(ul) {
  margin: 0;
  padding-left: 1.2em;
  font-size: var(--cd-type-small);
  line-height: 1.6;
  color: var(--cd-muted);
}
.cd-image-full :deep(li) {
  margin: 0.2em 0;
}
</style>
