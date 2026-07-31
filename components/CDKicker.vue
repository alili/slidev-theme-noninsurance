<script setup lang="ts">
// Small eyebrow label: crimson square + monospaced, letter-spaced caption.
// Use as <CDKicker text="Agenda" /> or <CDKicker>Agenda</CDKicker>.
defineProps<{ text?: string }>()
</script>

<template>
  <div class="cd-kicker">
    <span class="cd-kicker-dot" />
    <span><slot>{{ text }}</slot></span>
  </div>
</template>
