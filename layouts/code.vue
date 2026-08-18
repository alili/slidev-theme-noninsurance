<script setup lang="ts">
// Code — full-screen code slide. A justified title bar (h2 + monospaced
// filename) sits over a surface panel that fills the rest of the canvas.
// The panel's look (surface fill, crimson top border, padding) is provided by
// styles/code.css via `.slidev-layout pre`; this layout only stretches the
// slotted <pre> to fill the remaining height — it never restates the code bg.
// Long fences shrink --slidev-code-font-size to fit, then scroll inside <pre>.
// Frontmatter: title, file. Default slot: a fenced code block (```py / ```ts …).
import { onMounted, onUnmounted, ref } from 'vue'
import { useSlideTitle } from '../composables/useSlideTitle'

const MIN_CODE_PX = 16

const props = defineProps<{
  title?: string
  /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
  frontmatter?: Record<string, any>
  file?: string
}>()

const heading = useSlideTitle(props)
const body = ref<HTMLElement | null>(null)
let ro: ResizeObserver | null = null

function fitCode() {
  const root = body.value
  const pre = root?.querySelector('pre')
  if (!root || !pre || pre.clientHeight <= 0)
    return

  // Measure at the theme default so a resize can't compound a previous shrink.
  root.style.removeProperty('--slidev-code-font-size')
  const cs = getComputedStyle(pre)
  const pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
  const avail = pre.clientHeight - pad
  const text = pre.scrollHeight - pad
  if (avail <= 0 || text <= avail)
    return

  const next = Math.max(MIN_CODE_PX, Math.floor(parseFloat(cs.fontSize) * avail / text))
  root.style.setProperty('--slidev-code-font-size', `${next}px`)
}

onMounted(() => {
  if (body.value) {
    ro = new ResizeObserver(fitCode)
    ro.observe(body.value)
  }
  fitCode()
  document.fonts?.ready.then(fitCode)
})
onUnmounted(() => ro?.disconnect())
</script>

<template>
  <div class="slidev-layout cd-code">
    <div v-if="heading || file" class="cd-code__bar">
      <h2 v-if="heading" class="cd-code__title">{{ heading }}</h2>
      <span v-if="file" class="cd-code__file">{{ file }}</span>
    </div>
    <div ref="body" class="cd-code__body">
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
  overflow: hidden;
}

/* Slidev wraps the fence in .slidev-code-wrapper — THAT is the flex child.
   Stretch the wrapper, then let <pre> fill it and scroll. overflow on <pre>
   (not the wrapper) keeps the crimson top border pinned while the lines move. */
.cd-code__body :deep(.slidev-code-wrapper) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  margin: 0 !important;
}
.cd-code__body :deep(pre) {
  flex: 1;
  min-height: 0;
  margin: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  scrollbar-color: var(--cd-line) transparent;
}
</style>
