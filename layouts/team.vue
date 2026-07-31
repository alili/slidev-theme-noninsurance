<script setup lang="ts">
// Team — an h2 heading over a 4-column grid of project members. Each member is a
// surface "portrait" tile (a real <img> when `photo` is set, otherwise a dashed
// "人物照 0N" placeholder) with the name (small, weight 500) + role (micro, accent)
// underneath. Mirrors the original "团队 / 32" section of Crimson Deck.
//
// Frontmatter: members[] (structured). Heading via the `title` prop OR a markdown
// `## …` in the slot (styled the same). Bottom-right page number via <CDPageNumber />.

interface TeamMember {
  /** Portrait path; omit to render the "人物照 0N" placeholder tile. */
  photo?: string
  /** Member name (small, weight 500). */
  name: string
  /** Member role (micro, accent). */
  role?: string
}

withDefaults(
  defineProps<{
    title?: string
    members?: TeamMember[]
  }>(),
  {
    members: () => [
      { name: '张岭', role: '项目负责人' },
      { name: '陈毅', role: '流式架构' },
      { name: '林一舟', role: '语义层与治理' },
      { name: '周洁', role: '数据质量' },
    ],
  },
)

// 1-based, zero-padded index for the "人物照 0N" placeholder label.
const pad = (i: number) => String(i + 1).padStart(2, '0')
</script>

<template>
  <div class="slidev-layout cd-team">
    <div class="cd-team__head">
      <h2 v-if="title" class="cd-team__title">{{ title }}</h2>
      <slot v-else>
        <h2 class="cd-team__title">项目组成员</h2>
      </slot>
    </div>

    <div class="cd-team__grid">
      <div
        v-for="(member, i) in members"
        :key="i"
        class="cd-team__member"
      >
        <div class="cd-team__photo">
          <img
            v-if="member.photo"
            class="cd-team__img"
            :src="member.photo"
            :alt="member.name"
          />
          <div v-else class="cd-team__placeholder">人物照 {{ pad(i) }}</div>
        </div>
        <div class="cd-team__meta">
          <span class="cd-team__name">{{ member.name }}</span>
          <span v-if="member.role" class="cd-team__role">{{ member.role }}</span>
        </div>
      </div>
    </div>

    <CDPageNumber />
  </div>
</template>

<style scoped>
.cd-team {
  display: flex;
  flex-direction: column;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom);
}

/* heading — from the `title` prop or a markdown `#` / `##` written in the slot */
.cd-team__head {
  margin-bottom: var(--cd-gap-title);
}
.cd-team__title,
.cd-team__head :deep(h1),
.cd-team__head :deep(h2) {
  margin: 0;
  font-size: var(--cd-type-title);
  font-weight: 700;
  letter-spacing: -0.02em;
}
/* optional intro copy / list written in the slot */
.cd-team__head :deep(p) {
  margin: 16px 0 0;
  font-size: var(--cd-type-body);
  line-height: 1.5;
  color: var(--cd-muted);
  max-width: 1200px;
}
.cd-team__head :deep(ul),
.cd-team__head :deep(ol) {
  margin: 16px 0 0;
  padding-left: 1.4em;
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
}

/* 4-column member grid — fixed-height portraits, top-aligned like the original */
.cd-team__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 44px;
}
.cd-team__member {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

/* portrait tile — real photo (cover) or dashed "人物照 0N" placeholder */
.cd-team__photo {
  position: relative;
  height: 300px;
  overflow: hidden;
  background: var(--cd-surface);
}
.cd-team__img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.cd-team__placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
  outline: 1px dashed var(--cd-line);
  outline-offset: -1px;
}

/* name + role */
.cd-team__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cd-team__name {
  font-size: var(--cd-type-small);
  font-weight: 500;
}
.cd-team__role {
  font-size: var(--cd-type-micro);
  color: var(--cd-accent);
}
</style>
