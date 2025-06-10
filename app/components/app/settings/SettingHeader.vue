<script setup lang="ts">
import { tv } from 'tailwind-variants'

defineProps<{
  title?: string
  description?: string
  icon?: string
  iconClass?: string
}>()

const baseStyles = tv({
  slots: {
    icon: 'text-8xl',
  },
})

const styles = baseStyles()
</script>

<template>
  <div class="text-center">
    <div v-if="icon" class="px-4 text-black flex items-center justify-center">
      <Icon :name="icon" :class="styles.icon({ class: iconClass })" />
    </div>

    <h2 v-if="title" class="text-lg px-4 py-2 text-black">
      {{ title }}
    </h2>

    <p v-if="description" class="px-4 text-sm text-gray-500">
      {{ description }}
    </p>
  </div>
</template>
