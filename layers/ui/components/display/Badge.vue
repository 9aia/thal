<script setup lang="ts">
import { tv } from "tailwind-variants"

withDefaults(defineProps<{
  size?: keyof typeof variants["size"]
  is?: keyof HTMLElementTagNameMap
}>(), {
  size: "sm",
  is: "span",
})

const variants = {
  size: {
    xs: "badge-xs",
    sm: "badge-sm",
    md: "badge-md",
    lg: "badge-lg",
  },
} as const

const styles = tv({
  base: "badge",
  variants,
})
</script>

<template>
  <component :is="is" :class="styles({ size })">
    <slot />
  </component>
</template>
