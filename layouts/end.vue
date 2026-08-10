<script setup lang="ts">
// End — the closing card. Everything is centered on the dark canvas around an
// oversized monospace word ("END"): a soft crimson radial glow fills the frame,
// and a 2px accent line bleeds in from the top and bottom edges toward center.
// Frontmatter: eyebrow (micro mono uppercase label), big (the oversized word).
// Slot: <p> the closing note beneath the big word (e.g. "现在开始提问环节").
withDefaults(
  defineProps<{
    /** micro monospace uppercase label above the big word, wide-tracked accent */
    eyebrow?: string
    /** the oversized monospace word — the visual anchor of the page */
    big?: string
  }>(),
  {
    eyebrow: 'Thank you',
    big: 'END',
  },
)
</script>

<template>
  <div class="slidev-layout cd-end">
    <div class="cd-end__glow" />
    <div class="cd-end__line cd-end__line--top" />
    <div class="cd-end__line cd-end__line--bottom" />
    <div class="cd-end__stack">
      <span v-if="eyebrow" class="cd-end__eyebrow">{{ eyebrow }}</span>
      <h2 v-if="big" class="cd-end__big">{{ big }}</h2>
      <div class="cd-end__sub">
        <slot><p>现在开始提问环节</p></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* centered crimson radial glow filling the whole frame */
.cd-end__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(52% 62% at 50% 50%, rgba(var(--cd-accent-rgb), 0.3) 0%, rgba(var(--cd-accent-rgb), 0.05) 48%, transparent 74%);
}

/* thin accent lines bleeding in from the top & bottom edges toward center */
.cd-end__line {
  position: absolute;
  left: 50%;
  width: 2px;
  height: 200px;
}
.cd-end__line--top {
  top: 0;
  background: linear-gradient(180deg, var(--cd-accent), transparent);
}
.cd-end__line--bottom {
  bottom: 0;
  background: linear-gradient(0deg, var(--cd-accent), transparent);
}

/* centered stack: eyebrow / big word / closing note */
.cd-end__stack {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.cd-end__eyebrow {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  letter-spacing: 0.42em;
  color: var(--cd-accent);
  text-transform: uppercase;
}
.cd-end__big {
  margin: 0;
  font-family: var(--cd-font-mono);
  font-size: 220px;
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: 0.04em;
}

/* closing note — slotted markdown paragraph */
.cd-end__sub {
  text-align: center;
}
.cd-end__sub :deep(p) {
  margin: 0;
  font-size: var(--cd-type-subtitle);
  font-weight: 300;
  color: var(--cd-muted);
}
</style>
