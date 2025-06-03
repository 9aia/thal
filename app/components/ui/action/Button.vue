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
  iconPosition?: 'left' | 'right' | false
}>(), {
  as: 'button',
  noDisableOnLoading: false,
  iconSize: 'md',
  iconPosition: 'left',
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
      <span class="flex items-center justify-center gap-2" :class="{ 'flex-row-reverse': iconPosition === 'right' }">
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
