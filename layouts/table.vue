<script setup lang="ts">
// Table — a two-ends title bar (h2 + mono meta) above a full-width markdown
// table, with a micro muted note underneath. The table's visuals (accent
// header, zebra rows, line borders) come from the global stylesheet, so this
// layout only owns the frame, the title bar, and the monospace numerals for
// right-aligned cells.
// Frontmatter: title (left of the bar), meta (top-right micro mono),
// note (micro muted line below the table).
// Default slot: a markdown table. Use `--:` column alignment on the numeric
// columns so their header + cells right-align and switch to the mono face.
defineProps<{
  title?: string
  meta?: string
  note?: string
}>()
</script>

<template>
  <div class="slidev-layout cd-table">
    <div v-if="title || meta" class="cd-table__head">
      <h2 v-if="title" class="cd-table__title">{{ title }}</h2>
      <span v-if="meta" class="cd-table__meta">{{ meta }}</span>
    </div>

    <div class="cd-table__body">
      <slot />
    </div>

    <p v-if="note" class="cd-table__note">{{ note }}</p>
  </div>
</template>

<style scoped>
.cd-table {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* ---- title bar: two-ends aligned h2 + mono meta ------------------------ */
.cd-table__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
}
.cd-table__title {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-table__meta {
  margin-left: auto;
  flex: none;
  white-space: nowrap;
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}

/* ---- table body: visuals are global; only the numerals get the mono face */
.cd-table__body :deep(table) {
  margin: 0;
}
.cd-table__body :deep(tbody td[style*="right"]),
.cd-table__body :deep(tbody td[align="right"]) {
  font-family: var(--cd-font-mono);
}

/* ---- note under the table ---------------------------------------------- */
.cd-table__note {
  margin: 32px 0 0;
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
</style>
