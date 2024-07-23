<script setup lang="ts">
defineProps<{
  title?: string
  titleClass?: string
}>()
</script>

<template>
  <section>
    <slot name="header" />

    <div class="text-primary">
      <h2 v-if="title" class="font-bold text-sm py-2" :class="titleClass">
        {{ title }}
      </h2>
    </div>

    <slot />
  </section>
</template>
