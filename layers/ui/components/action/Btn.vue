<script setup lang="ts">
import type { VariantProps } from "tailwind-variants"
import { tv } from "tailwind-variants"
import { type ButtonHTMLAttributes, useAttrs } from "vue"
import type { SafeProps, SafeVariantProps } from "../../types"

withDefaults(defineProps<Props & {
  size?: keyof typeof variants["size"]
}>(), {
  size: "sm",
})

const variants = {
  size: {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  },
} as const

const styles = tv({
  base: "btn h-fit",
  variants,
})

type Props = SafeProps<ButtonHTMLAttributes> &
  SafeVariantProps<VariantProps<typeof styles>> & {
    loading?: boolean
    success?: boolean
  }

const attrs = useAttrs()
</script>

<template>
  <button
    :class="styles({ size, class: attrs.class as string })"
    :disabled="loading"
  >
    <slot />
    <span v-if="loading" class="loading loading-spinner" />
    <span v-else-if="success" class="material-symbols-outlined">
      check
    </span>
  </button>
</template>
