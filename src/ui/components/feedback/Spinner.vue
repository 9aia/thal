<script setup lang="ts">
import { tv } from 'tailwind-variants';

const variants = {
  size: {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  }
} as const;

const styles = tv({
  base: 'loading loading-spinner',
  variants,
})

withDefaults(defineProps<{
  size?: keyof typeof variants['size']
}>(), {
  size: 'sm'
})
</script>

<template>
  <span :class="styles({ size })"></span>
</template>