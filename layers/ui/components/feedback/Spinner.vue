<script setup lang="ts">
import { tv } from "tailwind-variants"

withDefaults(defineProps<{
  size?: keyof typeof variants["size"]
}>(), {
  size: "sm",
})

const variants = {
  size: {
    xs: "loading-xs",
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  },
} as const

const styles = tv({
  base: "loading loading-spinner",
  variants,
})
</script>

<template>
  <span :class="styles({ size })" />
</template>
