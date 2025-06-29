<script setup lang="ts">
import { tv } from 'tailwind-variants'

defineProps<{
  title?: string
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

    <h1 v-if="title" class="text-3xl px-4 py-2 text-black">
      {{ title }}
    </h1>
  </div>
</template>
