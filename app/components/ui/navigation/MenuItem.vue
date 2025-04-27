<script setup lang="ts">
import { t } from '@psitta/vue'
import { tv } from 'tailwind-variants'
import Icon from '../display/Icon.vue'
import ChevronRight from './ChevronRight.vue'
import type { MenuItemType } from './types'

defineProps<{
  is: MenuItemType
}>()

const iconStyles = tv({
  base: 'text-3xl',
  variants: {
    color: {
      normal: 'text-gray-800',
      warning: 'text-warning',
      info: 'text-info',
      danger: 'text-error',
    },
  },
})

const titleStyles = tv({
  base: 'text-sm',
  variants: {
    color: {
      normal: 'text-gray-900',
      warning: 'text-warning font-semibold',
      danger: 'text-error font-semibold',
      info: 'text-info font-semibold',
    },
  },
})

const descriptionStyles = tv({
  base: 'text-xs',
  variants: {
    color: {
      normal: 'text-gray-700',
      warning: 'text-warning',
      danger: 'text-error',
      info: 'text-info',
    },
  },
})
</script>

<template>
  <div class="flex w-full justify-between items-center">
    <div
      class="flex justify-between items-center gap-2"
    >
      <Icon v-if="is.icon" :class="iconStyles({ color: is.meaning || 'normal' })">
        {{ is.icon }}
      </Icon>

      <div class="flex flex-col w-full items-start">
        <div class="text-sm flex items-center justify-center gap-1" :class="titleStyles({ color: is.meaning || 'normal' })">
          {{ t(is.name) }}
          <slot name="title" />
        </div>

        <div v-if="is.description" :class="descriptionStyles({ color: is.meaning || 'normal' })">
          {{ is.description }}
          <slot name="description" />
        </div>
      </div>
    </div>

    <Icon v-if="is.type === 'external'" class="text-gray-800">
      material-symbols:north-east
    </Icon>
    <ChevronRight v-if="is.type === 'accordion'" />
  </div>
</template>
