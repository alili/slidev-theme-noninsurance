<script setup lang="ts">
// Compare — two-column before/after contrast beneath a section title.
// Frontmatter: title? (or a default-slot h2), leftLabel? ("Before"), rightLabel? ("After").
// Named slots ::left:: / ::right:: hold each column's body (muted vs. normal ink).
withDefaults(
  defineProps<{
    title?: string
    leftLabel?: string
    rightLabel?: string
  }>(),
  {
    leftLabel: 'Before',
    rightLabel: 'After',
  },
)
</script>

<template>
  <div class="slidev-layout cd-compare">
    <h2 v-if="title" class="cd-compare__title">{{ title }}</h2>
    <div v-else class="cd-compare__title-slot">
      <slot />
    </div>

    <div class="cd-compare__grid">
      <!-- Before / left -->
      <div class="cd-compare__col">
        <div class="cd-compare__label">
          <span class="cd-compare__dot" />
          <span class="cd-compare__tag">{{ leftLabel }}</span>
        </div>
        <div class="cd-compare__body cd-compare__body--muted">
          <slot name="left" />
        </div>
      </div>

      <!-- After / right -->
      <div class="cd-compare__col cd-compare__col--after">
        <div class="cd-compare__label">
          <span class="cd-compare__dot cd-compare__dot--accent" />
          <span class="cd-compare__tag cd-compare__tag--accent">{{ rightLabel }}</span>
        </div>
        <div class="cd-compare__body">
          <slot name="right" />
        </div>
      </div>
    </div>

    <CDPageNumber />
  </div>
</template>

<style scoped>
.cd-compare {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* Title — from the `title` prop or a default-slot h2 (28px gap to the grid). */
.cd-compare__title,
.cd-compare__title-slot :deep(h1),
.cd-compare__title-slot :deep(h2) {
  margin: 0 0 var(--cd-gap-title);
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* Two equal columns. */
.cd-compare__grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 96px;
}
.cd-compare__col {
  display: flex;
  flex-direction: column;
  gap: var(--cd-gap-item);
}
.cd-compare__col--after {
  border-left: 1px solid var(--cd-line);
  padding-left: 72px;
}

/* Square dot + mono micro-caps label. */
.cd-compare__label {
  display: flex;
  align-items: center;
  gap: 16px;
}
.cd-compare__dot {
  display: block;
  width: 12px;
  height: 12px;
  background: var(--cd-muted);
}
.cd-compare__dot--accent {
  background: var(--cd-accent);
}
.cd-compare__tag {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--cd-muted);
}
.cd-compare__tag--accent {
  color: var(--cd-accent);
}

/* Column body — user markdown (p / ul / strong / code / a). */
.cd-compare__body {
  display: flex;
  flex-direction: column;
  gap: var(--cd-gap-item);
}
.cd-compare__body :deep(p) {
  margin: 0;
  font-size: var(--cd-type-body);
  line-height: 1.65;
}
.cd-compare__body :deep(ul) {
  margin: 0;
  padding-left: 1.3em;
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}
.cd-compare__body :deep(li) {
  position: relative;
  font-size: var(--cd-type-body);
  line-height: 1.65;
}
.cd-compare__body :deep(li)::before {
  content: '';
  position: absolute;
  left: -1.3em;
  top: 0.62em;
  width: 8px;
  height: 8px;
  background: var(--cd-accent);
}
.cd-compare__body :deep(strong) {
  font-weight: 600;
}
.cd-compare__body :deep(code) {
  font-family: var(--cd-font-mono);
  font-size: 0.92em;
  background: var(--cd-surface-2);
  padding: 0.08em 0.34em;
  border-radius: 4px;
}
.cd-compare__body :deep(a) {
  color: var(--cd-accent);
  text-decoration: none;
}

/* The "before" column reads muted (ink + bullets). */
.cd-compare__body--muted :deep(p),
.cd-compare__body--muted :deep(li) {
  color: var(--cd-muted);
}
.cd-compare__body--muted :deep(li)::before {
  background: var(--cd-muted);
}
</style>
