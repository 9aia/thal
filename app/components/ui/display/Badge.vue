<script setup lang="ts">
import { tv } from 'tailwind-variants'

const props = withDefaults(defineProps<{
  size?: keyof typeof variants['size']
  is?: keyof HTMLElementTagNameMap
  noBg?: boolean
}>(), {
  size: 'sm',
  is: 'span',
  noBg: false,
})

const variants = {
  size: {
    xs: 'badge-xs',
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
  },
} as const

const styles = computed(() => tv({
  base: props.noBg ? 'badge border-none"' : 'badge border-none bg-gradient-badge text-blue-500',
  variants,
}))
</script>

<template>
  <component :is="is" :class="styles({ size })">
    <slot />
  </component>
</template>

<style scoped>
.bg-gradient-badge {
  background: radial-gradient(at bottom, var(--color-blue-100), var(--color-gray-50));
}
</style>
