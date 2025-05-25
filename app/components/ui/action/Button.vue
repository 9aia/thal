<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import { tv } from 'tailwind-variants'
import type { ButtonHTMLAttributes } from 'vue'
import type { SafeProps, SafeVariantProps } from '~/types'

const props = withDefaults(defineProps<Props & {
  size?: keyof typeof variants['size']
  shape?: 'circle' | 'square' | 'normal'
  class?: string
  noDisableOnLoading?: boolean
  icon?: string
}>(), {
  size: 'sm',
  shape: 'normal',
  class: '',
  noDisableOnLoading: false,
})

const slots = defineSlots()

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
    normal: 'rounded-full px-4 py-2',
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
    <div v-if="slots.label">
      <span class="px-4 py-1 flex items-center justify-center gap-1">
        <span v-if="loading" class="loading loading-md loading-spinner" />
        <Icon v-else-if="icon" :name="icon" />

        <component :is="slots.label" />
      </span>
    </div>
    <slot v-else-if="!loading" />
    <span v-else-if="loading" class="loading loading-xs loading-spinner" />
    <span v-else-if="success" class="material-symbols-outlined">
      check
    </span>
  </button>
</template>
