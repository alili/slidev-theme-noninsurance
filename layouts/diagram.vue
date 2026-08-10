<script setup lang="ts">
// Diagram — titled surface that hosts a mermaid/plantuml block, with an
// optional 3-column footnote row below it.
// Frontmatter: title, label, notes[]. Default slot: the ```mermaid``` (or
// ```plantuml```) code block; Slidev renders the actual diagram, this layout
// only supplies the framed surface.
import { useSlideTitle } from '../composables/useSlideTitle'

interface DiagramNote {
  /** Monospaced accent key, e.g. a pipeline stage name. */
  key: string
  /** Small muted supporting sentence. */
  text: string
}

interface Props {
  /** Section title, rendered as the left-aligned h2 in the header bar. */
  title?: string
  /** Slidev reserves `title:` — useSlideTitle reads it back from here. */
  frontmatter?: Record<string, any>
  /** Monospaced uppercase micro accent shown at the top-right. */
  label?: string
  /** Optional 3-column footnotes rendered under the diagram surface. */
  notes?: DiagramNote[]
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Mermaid',
  notes: () => [
    { key: '采集', text: 'CDC 直接落 Kafka，不再走每日抽取' },
    { key: '加工', text: '15 分钟窗口聚合，支持按分区回放' },
    { key: '消费', text: '看板与告警共用同一套指标定义' },
  ],
})

// The sample title is the fallback, not a `withDefaults` value — a default
// would win over the frontmatter and pin every diagram to the demo heading.
const heading = useSlideTitle(props, '端到端数据链路')
</script>

<template>
  <div class="slidev-layout cd-diagram">
    <div class="cd-diagram__head">
      <h2 v-if="heading" class="cd-diagram__title">{{ heading }}</h2>
      <span v-if="label" class="cd-diagram__label">{{ label }}</span>
    </div>

    <div class="cd-diagram__surface">
      <slot>
        <div class="cd-diagram__placeholder">Mermaid 流程图</div>
      </slot>
    </div>

    <div v-if="notes && notes.length" class="cd-diagram__notes">
      <div v-for="(note, i) in notes" :key="i" class="cd-diagram__note">
        <span class="cd-diagram__note-key">{{ note.key }}</span>
        <span class="cd-diagram__note-text">{{ note.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-diagram {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* ---- header bar: title left, micro accent label right ------------------ */
.cd-diagram__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 40px;
}
.cd-diagram__title {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.cd-diagram__label {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  letter-spacing: 0.16em;
  color: var(--cd-accent);
  text-transform: uppercase;
}

/* ---- diagram surface: fixed-height framed container -------------------- */
.cd-diagram__surface {
  height: 520px;
  flex: none;
  display: flex;
  flex-direction: column;
  background: var(--cd-surface);
  border-top: 3px solid var(--cd-accent);
  padding: 36px 48px;
  box-sizing: border-box;
}
.cd-diagram__placeholder {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: 1px dashed var(--cd-line);
  color: var(--cd-muted);
  font-size: var(--cd-type-small);
}

/* ---- footnotes: 3 columns, each with an accent key + muted text -------- */
.cd-diagram__notes {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 56px;
  margin-top: var(--cd-gap-title);
  align-content: start;
}
.cd-diagram__note {
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid var(--cd-line);
  padding-top: 22px;
}
.cd-diagram__note-key {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-accent);
}
.cd-diagram__note-text {
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
  line-height: 1.5;
}

/* ---- slot-rendered diagram (mermaid / plantuml) fills the surface ------ */
.cd-diagram__surface :deep(pre) {
  margin: 0;
}
.cd-diagram__surface :deep(.mermaid),
.cd-diagram__surface :deep(.slidev-mermaid) {
  flex: 1;
  min-height: 0;
  width: 100%;
  margin: 0;
}
.cd-diagram__surface :deep(.mermaid > svg),
.cd-diagram__surface :deep(.slidev-mermaid > svg) {
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
}
</style>
