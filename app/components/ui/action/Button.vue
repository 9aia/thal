<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'
import type { ButtonHTMLAttributes } from 'vue'
import type { SafeProps, SafeVariantProps } from '~/types'

const props = withDefaults(defineProps<Props & {
  size?: keyof typeof variants['size']
  shape?: 'circle' | 'square' | 'normal'
  class: string
  noDisableOnLoading?: boolean
}>(), {
  size: 'sm',
  shape: 'normal',
  class: '',
  noDisableOnLoading: false,
})

const variants = {
  size: {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  },
  shape: {
    circle: 'btn-circle',
    square: 'btn-square',
    normal: '',
  },
} as const

const styles = tv({
  base: 'btn h-fit',
  variants,
})

type Props = SafeProps<ButtonHTMLAttributes> &
  SafeVariantProps<VariantProps<typeof styles>> & {
    loading?: boolean
    success?: boolean
  }
</script>

<template>
  <button
    :class="styles({ size, shape, class: props.class })"
    :disabled="loading && !noDisableOnLoading"
  >
    <slot v-if="!loading" />
    <span v-if="loading" class="loading loading-spinner" />
    <span v-else-if="success" class="material-symbols-outlined">
      check
    </span>
  </button>
</template>
