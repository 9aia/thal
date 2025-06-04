<script setup lang="ts">
import { useCountdown } from '@vueuse/core'
import { tv } from 'tailwind-variants'
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

  resetIn?: number
}>(), {
  as: 'button',
  noDisableOnLoading: false,
  iconPosition: 'left',
  resetIn: 0,
})

const emit = defineEmits(['click'])
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
  emit('click')
}

const remainingFormatted = computed(() => v([countdown.remaining.value, {
  style: 'unit',
  unit: 'second',
  unitDisplay: 'narrow',
}]))

const iconStyles = tv({
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})
</script>

<template>
  <button
    ref="buttonElement"
    :disabled="isDisabled"
    class="flex items-center justify-center gap-2"
    :class="{ 'flex-row-reverse': iconPosition === 'right' }"
    @click="handleClick"
  >
    <span v-if="loading" class="loading loading-xs loading-spinner" />
    <Icon v-else-if="success" name="material-symbols:check-rounded" />
    <Icon v-else-if="icon" :name="icon" :class="iconStyles({ size: iconSize })" />

    <slot />

    <span v-if="countdown.remaining.value > 0 && countdown.isActive.value">
      ({{ remainingFormatted }})
    </span>
  </button>
</template>
