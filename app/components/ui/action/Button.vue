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
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
}>(), {
  size: 'sm',
  iconSize: 'md',
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
    normal: 'rounded-full px-4 py-2',
  },
} as const

const styles = tv({
  base: 'btn h-fit border-none',
  variants,
})

const loadingSize = computed(() => {
  const options = {
    xs: '',
    sm: 'loading-xs',
    md: 'loading-sm',
    lg: 'loading-md',
    xl: 'loading-lg',
  }

  return options[props.iconSize]
})

const iconSize = computed(() => {
  const options = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  return options[props.iconSize]
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
    <div v-if="icon">
      <span class="px-4 py-1 flex items-center justify-center gap-1">
        <span v-if="loading" class="loading loading-spinner" :class="loadingSize" />
        <Icon v-else-if="icon" :name="icon" :class="iconSize" />

        <slot />
      </span>
    </div>
    <slot v-else-if="!loading" />
    <span v-else-if="loading" class="loading loading-xs loading-spinner" />
    <span v-else-if="success" class="material-symbols-outlined">
      check
    </span>
  </button>
</template>
