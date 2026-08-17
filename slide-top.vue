<script setup lang="ts">
/**
 * Per-slide overlay layer.
 *
 * Slidev picks `slide-top.vue` up from every root it knows about — the theme's
 * included — and mounts it once per slide, immediately after the slide's own
 * component. That placement is what the footer needs on both counts: it paints
 * above layouts that fill the canvas (`section`, `image-full`), and it lives
 * inside `.slidev-page`, so it scales with the 1920×1080 canvas and lands in
 * every exported PNG / PDF page.
 *
 * A deck can still ship its own `slide-top.vue`; Slidev renders all of them.
 */
import CDFooter from './components/CDFooter.vue'
</script>

<template>
  <CDFooter />
</template>
