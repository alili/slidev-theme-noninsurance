<script setup lang="ts">
// Bottom-right page number. Reads Slidev's current page; falls back to a slot.
</script>

<template>
  <div class="cd-page-num">
    <slot>{{ $slidev?.nav?.currentPage }}</slot>
  </div>
</template>
