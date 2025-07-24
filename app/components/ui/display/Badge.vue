<script setup lang="ts">
import { tv } from 'tailwind-variants'

const props = withDefaults(defineProps<{
  size?: keyof typeof variants['size']
  is?: keyof HTMLElementTagNameMap
  noBg?: boolean
  color?: keyof typeof variants['color']
  icon?: string
  iconPosition?: 'left' | 'right'
  iconClass?: string
}>(), {
  size: 'sm',
  is: 'span',
  noBg: false,
  color: 'primary',
  iconPosition: 'left',
})

const variants = {
  size: {
    xs: 'badge-xs px-0.5 py-0.5',
    sm: 'badge-sm px-2 py-0.5',
    md: 'badge-md px-2 py-2',
    lg: 'badge-lg px-3 py-3',
  },
  color: {
    primary: 'bg-gradient-primary text-primary',
    secondary: 'bg-gradient-secondary text-secondary',
    accent: 'bg-gradient-accent text-accent',
    warning: 'bg-gradient-warning text-warning',
    error: 'bg-gradient-error text-error',
    info: 'bg-gradient-info text-info',
    success: 'bg-gradient-success text-success',
    neutral: 'bg-gradient-neutral text-gray-500',
  },
  iconPosition: {
    left: 'flex-row',
    right: 'flex-row-reverse',
  },
} as const

const badge = computed(() => tv({
  base: 'rounded-full text-blue-500 flex items-center justify-center gap-1',
  variants,
}))

const iconStyles = tv({
  variants: {
    size: {
      xs: 'text-lg',
      sm: 'text-xl',
      md: 'text-2xl',
      lg: 'text-3xl',
    },
  },
})
</script>

<template>
  <component :is="is" :class="props.noBg ? 'badge border-none' : badge({ size, color, iconPosition })">
    <Icon
      v-if="icon"
      :name="icon"
      :class="iconStyles({ size, class: iconClass })"
    />
    <slot />
  </component>
</template>

<style scoped>
.bg-gradient-primary {
  background: radial-gradient(at bottom, var(--color-blue-100), var(--color-gray-50));
}

.bg-gradient-secondary {
  background: radial-gradient(at bottom, var(--color-magenta-50), var(--color-gray-50));
}

.bg-gradient-warning {
  background: radial-gradient(at bottom, var(--color-orange-100), var(--color-gray-50));
}

.bg-gradient-error {
  background: radial-gradient(at bottom, var(--color-red-100), var(--color-gray-50));
}

.bg-gradient-info {
  background: radial-gradient(at bottom, var(--color-blue-100), var(--color-gray-50));
}

.bg-gradient-success {
  background: radial-gradient(at bottom, var(--color-green-100), var(--color-gray-50));
}

.bg-gradient-neutral {
  background: radial-gradient(at bottom, var(--color-gray-100), var(--color-gray-50));
}
</style>
