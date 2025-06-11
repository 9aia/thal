<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { MenuItemType } from './types'

const props = defineProps<{
  items: MenuItemType[]
  class?: string
  liClass?: string
  itemClass?: string
}>()

const emit = defineEmits<{
  (e: 'action', emitValue: string): void
}>()

function closeMenu() {
  const elem = document.activeElement as any

  if (elem)
    elem?.blur()
}

const baseStyles = tv({
  slots: {
    base: 'w-full space-y-2',
    li: 'group',
    item: 'group flex px-2 py-1 w-full rounded-2xl focus:outline-2 focus:outline-offset-2 focus:outline-blue-500',
  },
})

const styles = baseStyles()
</script>

<template>
  <ul :class="styles.base({ class: props.class })">
    <slot name="prepend" />

    <li
      v-for="item in items"
      :key="item.id"
      :class="styles.li({ class: liClass })"
      @click="closeMenu"
    >
      <Item
        :is="item"
        :class="styles.item({ class: itemClass })"
        @action="emit('action', $event)"
      />
    </li>

    <slot name="append" />
  </ul>
</template>
