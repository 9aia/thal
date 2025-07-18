<script setup lang="ts">
import { t } from '@psitta/vue'
import { tv } from 'tailwind-variants'
import Icon from '../display/Icon.vue'
import ChevronRight from './ChevronRight.vue'
import type { MenuItemType } from './types'

defineProps<{
  is: MenuItemType
  wrapperClass?: string
}>()

const iconStyles = tv({
  base: 'text-2xl',
  variants: {
    color: {
      normal: 'text-black',
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
      normal: 'text-black',
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
      normal: 'text-gray-600',
      warning: 'text-warning',
      danger: 'text-error',
      info: 'text-info',
    },
  },
})

const wrapperStyles = tv({
  base: 'flex justify-between items-center gap-2',
})
</script>

<template>
  <div class="flex w-full justify-between items-center gap-1">
    <div
      :class="wrapperStyles({ class: wrapperClass })"
    >
      <Icon v-if="is.icon" :class="iconStyles({ color: is.meaning || 'normal' })">
        {{ is.icon }}
      </Icon>

      <div class="flex flex-col w-full items-start">
        <div class="text-sm flex items-center justify-center gap-1" :class="titleStyles({ color: is.meaning || 'normal' })">
          <template v-if="is.name">
            {{ t(is.name) }}
          </template>

          <slot name="title" />
        </div>

        <div v-if="is.description" :class="descriptionStyles({ color: is.meaning || 'normal' })">
          {{ is.description }}
          <slot name="description" />
        </div>
      </div>
    </div>

    <Icon v-if="is.type === 'external'" name="material-symbols:north-west-rounded" class="rotate-90 text-gray-800" />
    <ChevronRight v-if="is.type === 'accordion'" />
  </div>
</template>
