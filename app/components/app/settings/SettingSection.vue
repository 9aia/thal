<script setup lang="ts">
defineProps<{
  title?: string
  titleClass?: string
}>()
</script>

<template>
  <section>
    <slot name="header" />

    <div v-if="title" class="text-brown-500">
      <h2 class="text-sm py-2" :class="titleClass">
        {{ title }}
      </h2>
    </div>

    <slot />
  </section>
</template>
