<script setup lang="ts">
defineProps<{
  itemClass: string
}>()
</script>

<template>
  <div class="indicator">
    <span class="indicator-item" :class="itemClass">
      <slot name="item" />
    </span>
    <slot />
  </div>
</template>
