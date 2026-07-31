<script setup lang="ts">
// Image-right — mirror of image-left: the narrative column (kicker + h2 +
// crimson-bullet list) sits on the LEFT, a surface-framed visual on the RIGHT.
// Frontmatter: image (screenshot path), split (grid columns, default "860px 1fr").
// Default slot = <CDKicker> + <h2> + <ul>, authored in markdown.
// Named slot ::image:: takes a CDChart / screenshot; else falls back to the
// `image` prop, else a dashed "drop a screenshot here" placeholder.
defineProps<{
  image?: string
  split?: string
}>()
</script>

<template>
  <div
    class="slidev-layout cd-image-right"
    :style="{ gridTemplateColumns: split || '860px 1fr' }"
  >
    <div class="cd-image-right__text">
      <slot />
    </div>

    <div class="cd-image-right__media">
      <div v-if="$slots.image" class="cd-image-right__slot">
        <slot name="image" />
      </div>
      <img
        v-else-if="image"
        class="cd-image-right__img"
        :src="image"
        alt=""
      />
      <div v-else class="cd-image-right__placeholder">
        拖入产品截图 / 保持完整比例
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ---- shell: text | media, both full height ----------------------------- */
.cd-image-right {
  display: grid;
  grid-template-rows: 100%;
  /* grid-template-columns comes from the `split` prop (default 860px 1fr) */
}

/* ---- left: narrative column, vertically centered ----------------------- */
.cd-image-right__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--cd-pad-top) 80px var(--cd-pad-bottom) var(--cd-pad-x);
  box-sizing: border-box;
  min-width: 0;
}
.cd-image-right__text :deep(.cd-kicker) {
  margin-bottom: 32px;
}
.cd-image-right__text :deep(h2) {
  margin: 0 0 32px;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.cd-image-right__text :deep(p) {
  margin: 0 0 22px;
  font-size: var(--cd-type-small);
  line-height: 1.55;
  color: var(--cd-muted);
}
.cd-image-right__text :deep(ul) {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.cd-image-right__text :deep(li) {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin: 0;
  padding: 0;
  font-size: var(--cd-type-small);
  line-height: 1.55;
  color: var(--cd-muted);
}
.cd-image-right__text :deep(li)::before {
  content: "";
  flex: none;
  width: 10px;
  height: 10px;
  margin-top: 16px;
  background: var(--cd-accent);
}

/* ---- right: surface-framed visual -------------------------------------- */
.cd-image-right__media {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 100px 80px 72px;
  background: var(--cd-surface);
  box-sizing: border-box;
  min-width: 0;
  overflow: hidden;
}
.cd-image-right__slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.cd-image-right__slot :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}
.cd-image-right__img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}
.cd-image-right__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  text-align: center;
  color: var(--cd-muted);
  font-size: var(--cd-type-small);
  border-radius: 8px;
  outline: 1px dashed var(--cd-line);
  outline-offset: -1px;
}
</style>
