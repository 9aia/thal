<script setup lang="ts">
import { useCountdown, useEventListener } from '@vueuse/core'
import { tv } from 'tailwind-variants'
import type { ButtonHTMLAttributes } from 'vue'
import type { SafeProps } from '~/types'

const props = withDefaults(defineProps<Props & {
  as?: string

  disabled?: boolean
  loading?: boolean
  noDisableOnLoading?: boolean
  success?: boolean

  icon?: string
  iconClass?: string
  iconPosition?: 'left' | 'right' | false

  resetIn?: number
}>(), {
  as: 'button',
  noDisableOnLoading: false,
  iconPosition: 'left',
  resetIn: 0,
})

const { v } = useI18nExperimental()

type Props = SafeProps<ButtonHTMLAttributes>
const buttonElement = useTemplateRef<HTMLButtonElement>('buttonElement')

defineExpose({
  buttonElement,
})

const countdown = useCountdown(toRef(() => props.resetIn))

onActivated(() => {
  countdown.start(countdown.remaining.value)
})

const isDisabled = computed(() => {
  if (countdown.remaining.value > 0 && countdown.isActive.value) {
    return true
  }

  if (props.disabled) {
    return props.disabled
  }

  if (!props.noDisableOnLoading) {
    return props.loading
  }

  return false
})

function handleClick() {
  countdown.start()
}

const remainingFormatted = computed(() => v([countdown.remaining.value, {
  style: 'unit',
  unit: 'second',
  unitDisplay: 'narrow',
}]))

const iconStyles = tv({
  base: '',
})

useEventListener(buttonElement, 'click', handleClick)
</script>

<template>
  <button
    ref="buttonElement"
    :disabled="isDisabled"
    class="flex items-center justify-center gap-2"
    :class="{ 'flex-row-reverse': iconPosition === 'right' }"
  >
    <span v-if="loading" class="loading loading-xs loading-spinner" />
    <Icon v-else-if="success" name="material-symbols:check-rounded" />
    <Icon v-else-if="icon" :name="icon" :class="iconStyles({ class: iconClass })" />

    <slot />

    <span v-if="countdown.remaining.value > 0 && countdown.isActive.value">
      ({{ remainingFormatted }})
    </span>
  </button>
</template>
