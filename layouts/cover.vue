<script setup lang="ts">
// Cover — bottom-aligned title with a top-right crimson glow and a meta row.
// Frontmatter: kicker, speaker, org, date. Slot: <h1> title + <p> subtitle.
// NOTE: use `speaker` (not `author`) — on the first slide `author` is a reserved
// Slidev headmatter field and never reaches the layout.
defineProps<{
  kicker?: string
  speaker?: string
  org?: string
  date?: string
}>()
</script>

<template>
  <div class="slidev-layout cd-cover">
    <div class="cd-cover__glow" />
    <div class="cd-cover__bar" />
    <div class="cd-cover__body">
      <CDKicker v-if="kicker" :text="kicker" />
      <div class="cd-cover__content">
        <slot />
      </div>
    </div>
    <div v-if="speaker || org || date" class="cd-cover__meta">
      <span v-if="speaker">汇报人 / {{ speaker }}</span>
      <span v-if="org">{{ org }}</span>
      <span v-if="date">{{ date }}</span>
    </div>
  </div>
</template>

<style scoped>
.cd-cover {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}
.cd-cover__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(70% 90% at 88% 12%, rgba(200, 20, 24, 0.42) 0%, rgba(200, 20, 24, 0.08) 45%, transparent 70%);
}
.cd-cover__bar {
  position: absolute;
  top: 0;
  left: var(--cd-pad-x);
  width: 2px;
  height: 340px;
  background: linear-gradient(180deg, var(--cd-accent), transparent);
}
.cd-cover__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 36px;
}
.cd-cover__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cd-cover__content :deep(h1) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 900;
  line-height: 1.06;
  letter-spacing: -0.02em;
  max-width: 1400px;
  text-wrap: pretty;
}
.cd-cover__content :deep(p) {
  margin: 0;
  font-size: var(--cd-type-subtitle);
  font-weight: 300;
  color: var(--cd-muted);
  max-width: 1150px;
}
.cd-cover__meta {
  position: relative;
  margin-top: 64px;
  display: flex;
  gap: 56px;
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
  border-top: 1px solid var(--cd-line);
  padding-top: 28px;
}
</style>
