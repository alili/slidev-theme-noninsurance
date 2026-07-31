<script setup lang="ts">
// Contact — two-column closer. Left: a kicker, an oversized title and a set of
// labeled contact rows (icon + label/value, hairline-separated). Right: a
// surface panel with a crimson edge accent holding a framed QR placeholder and
// a "scan me" caption.
// Frontmatter: kicker, contacts[], qr, qrCaption. Slot: <h2> title (+ optional <p>).
interface Contact {
  icon: string
  label: string
  value: string
  // Render the value in the monospaced face (for emails / handles).
  mono?: boolean
}

withDefaults(
  defineProps<{
    kicker?: string
    contacts?: Contact[]
    qr?: string
    qrCaption?: string
  }>(),
  {
    kicker: 'Contact',
    qrCaption: '扫码加微信',
    contacts: () => [
      { icon: 'mail', label: '邮箱', value: 'zhangling@example.com', mono: true },
      { icon: 'message-circle', label: '微信号', value: 'zhangling_data', mono: true },
      { icon: 'building-2', label: '团队', value: '平台工程部 · 数据平台组' },
    ],
  },
)
</script>

<template>
  <div class="slidev-layout cd-contact">
    <!-- Left: kicker + title + labeled contact rows -->
    <div class="cd-contact__left">
      <CDKicker class="cd-contact__kicker" :text="kicker" />
      <div class="cd-contact__title">
        <slot><h2>保持联系</h2></slot>
      </div>
      <div class="cd-contact__list">
        <div v-for="(c, i) in contacts" :key="i" class="cd-contact__item">
          <div
            class="cd-contact__icon"
            :class="`i-lucide-${c.icon}`"
            style="width: 36px; height: 36px; color: var(--cd-accent)"
          />
          <div class="cd-contact__text">
            <span class="cd-contact__label">{{ c.label }}</span>
            <span class="cd-contact__value" :class="{ 'is-mono': c.mono }">{{ c.value }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: framed QR placeholder on a surface panel -->
    <div class="cd-contact__right">
      <div class="cd-contact__accent" />
      <div class="cd-contact__qr-frame">
        <img v-if="qr" :src="qr" alt="二维码" class="cd-contact__qr-img" />
        <div v-else class="cd-contact__qr-ph">二维码</div>
      </div>
      <div class="cd-contact__caption">
        <div class="i-lucide-qr-code" style="width: 30px; height: 30px; color: var(--cd-accent)" />
        <span>{{ qrCaption }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cd-contact {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* ---- left: contact rows ------------------------------------------------ */
.cd-contact__left {
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--cd-pad-top) 72px var(--cd-pad-bottom) var(--cd-pad-x);
}
.cd-contact__kicker {
  margin-bottom: 36px;
}
.cd-contact__title {
  margin-bottom: var(--cd-gap-title);
}
.cd-contact__title :deep(h1),
.cd-contact__title :deep(h2) {
  margin: 0;
  font-size: 64px;
  font-weight: 700;
  line-height: 1.14;
  letter-spacing: -0.02em;
}
.cd-contact__title :deep(p) {
  margin: 16px 0 0;
  font-size: var(--cd-type-body);
  line-height: 1.6;
  color: var(--cd-muted);
}
.cd-contact__title :deep(ul) {
  margin: 16px 0 0;
  padding-left: 1.2em;
  font-size: var(--cd-type-body);
  color: var(--cd-muted);
}

.cd-contact__list {
  display: flex;
  flex-direction: column;
}
.cd-contact__item {
  display: flex;
  align-items: center;
  gap: var(--cd-gap-item);
  padding: 28px 0;
  border-top: 1px solid var(--cd-line);
}
.cd-contact__item:last-child {
  border-bottom: 1px solid var(--cd-line);
}
.cd-contact__icon {
  flex: none;
}
.cd-contact__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cd-contact__label {
  font-size: var(--cd-type-micro);
  color: var(--cd-muted);
}
.cd-contact__value {
  font-size: var(--cd-type-body);
}
.cd-contact__value.is-mono {
  font-family: var(--cd-font-mono);
}

/* ---- right: framed QR on a surface panel ------------------------------- */
.cd-contact__right {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  box-sizing: border-box;
  padding: var(--cd-pad-top) var(--cd-pad-x) var(--cd-pad-bottom) 72px;
  background: var(--cd-surface);
}
.cd-contact__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--cd-accent);
}
.cd-contact__qr-frame {
  display: flex;
  padding: 22px;
  background: #e8e6e6;
  outline: 1px dashed rgba(0, 0, 0, 0.35);
  outline-offset: -10px;
}
.cd-contact__qr-img {
  width: 420px;
  height: 420px;
  object-fit: contain;
}
.cd-contact__qr-ph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 420px;
  height: 420px;
  font-size: var(--cd-type-body);
  letter-spacing: 0.1em;
  color: rgba(0, 0, 0, 0.35);
}
.cd-contact__caption {
  display: flex;
  align-items: center;
  gap: 14px;
}
.cd-contact__caption span {
  font-size: var(--cd-type-small);
  color: var(--cd-muted);
}
</style>
