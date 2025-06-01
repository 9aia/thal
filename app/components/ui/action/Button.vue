<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import type { SafeProps } from '~/types'

const props = withDefaults(defineProps<Props & {
  as?: string

  disabled?: boolean
  loading?: boolean
  noDisableOnLoading?: boolean
  success?: boolean

  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
}>(), {
  as: 'button',
  noDisableOnLoading: false,
  iconSize: 'md',
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

type Props = SafeProps<ButtonHTMLAttributes>

const isDisabled = computed(() => {
  if (props.disabled) {
    return props.disabled
  }

  if (!props.noDisableOnLoading) {
    return props.loading
  }

  return false
})
</script>

<template>
  <button
    :disabled="isDisabled"
  >
    <div v-if="icon">
      <span class="px-4 py-1 flex items-center justify-center gap-1">
        <span v-if="loading" class="loading loading-xs loading-spinner" />
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
