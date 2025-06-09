<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon: string
}>()
</script>

<template>
  <div class="text-center">
    <div v-if="icon" class="px-4 text-black flex items-center justify-center">
      <Icon :name="icon" class="text-8xl" />
    </div>

    <h2 v-if="title" class="text-lg px-4 py-2 text-black">
      {{ title }}
    </h2>

    <p v-if="description" class="px-4 text-sm text-gray-500">
      {{ description }}
    </p>
  </div>
</template>
