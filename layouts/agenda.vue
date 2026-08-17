<script setup lang="ts">
// Agenda — two-column table of contents. Each row pairs a monospaced index with
// a title + note above a hairline top rule. Fully data-driven (no markdown slot).
// Frontmatter: kicker (eyebrow, default "Agenda"), items[] { no, title, desc? }.
interface AgendaItem {
  no: string
  title: string
  desc?: string
}

withDefaults(
  defineProps<{
    kicker?: string
    items?: AgendaItem[]
  }>(),
  {
    kicker: 'Agenda',
    items: () => [
      { no: '01', title: '项目背景', desc: '为什么现在重构' },
      { no: '02', title: '架构与实现', desc: '链路、组件与关键代码' },
      { no: '03', title: '效果数据', desc: '成本、延迟与故障率' },
      { no: '04', title: '下一阶段计划', desc: 'Q3 与 Q4 里程碑' },
    ],
  },
)
</script>

<template>
  <div class="slidev-layout cd-agenda">
    <CDKicker v-if="kicker" :text="kicker" />
    <div class="cd-agenda__grid">
      <div v-for="item in items" :key="item.no" class="cd-agenda__item">
        <span class="cd-agenda__no">{{ item.no }}</span>
        <div class="cd-agenda__text">
          <span class="cd-agenda__title">{{ item.title }}</span>
          <span v-if="item.desc" class="cd-agenda__desc">{{ item.desc }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-agenda {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
  gap: var(--cd-gap-title);
}
.cd-agenda__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px 80px;
}
.cd-agenda__item {
  display: flex;
  align-items: baseline;
  gap: 32px;
  padding: var(--cd-gap-item) 0;
  border-top: 1px solid var(--cd-line);
}
.cd-agenda__no {
  font-family: var(--cd-font-mono);
  font-size: var(--cd-type-body);
  color: var(--cd-accent);
}
.cd-agenda__text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cd-agenda__title {
  font-size: var(--cd-type-subtitle);
  font-weight: 500;
}
.cd-agenda__desc {
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
</style>
