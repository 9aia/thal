<script setup lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import { useCountdown } from '@vueuse/core'
import type { MaybePromise } from 'vee-validate'
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

  resetIn?: number
}>(), {
  as: 'button',
  noDisableOnLoading: false,
  iconSize: 'md',
  iconPosition: 'left',
  resetIn: 0,
})

const emit = defineEmits<{
  (e: 'click'): any
}>()

const buttonElement = useTemplateRef<HTMLButtonElement>('buttonElement')

defineExpose({
  buttonElement,
})

const countdown = toRef(() => props.resetIn)
const { start } = useCountdown(countdown, {
  onComplete: () => {
    emit('click')
  },
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

  if (countdown.value > 0) {
    return true
  }

  return false
})
</script>

<template>
  <button
    ref="buttonElement"
    :disabled="isDisabled"
    @click="countdown > 0 ? start() : emit('click')"
  >
    <div v-if="icon">
      <span class="flex items-center justify-center gap-2" :class="{ 'flex-row-reverse': iconPosition === 'right' }">
        <span v-if="loading" class="loading loading-xs loading-spinner" />
        <Icon v-else-if="icon" :name="icon" :class="iconSize" />

        <slot />
        <span v-if="countdown > 0">({{ countdown }}s)</span>
      </span>
    </div>
    <slot v-else-if="!loading" />
    <span v-else-if="loading" class="loading loading-xs loading-spinner" />
    <span v-else-if="success" class="material-symbols-outlined">
      check
    </span>
    <span v-if="countdown > 0 && !icon">({{ countdown }}s)</span>
  </button>
</template>
