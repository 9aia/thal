<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { MenuItemType } from './types'
import Item from './Item.vue'

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
    base: 'cursor-auto dropdown-content bg-base-100 rounded-2xl z-1 w-56 p-4 shadow-2xl mt-3 overflow-visible space-y-2',
    li: '',
    item: 'flex px-2 py-1 w-full rounded-2xl focus:outline-2 focus:outline-offset-2 focus:outline-blue-500',
  },
})

const styles = baseStyles()

function click(item: MenuItemType) {
  if (item.closeMenu ?? true) {
    closeMenu()
  }
}
</script>

<template>
  <ul
    :class="styles.base({ class: props.class })"
    @click.stop
  >
    <li
      v-for="item in items"
      :key="item.id"
      :class="styles.li({ class: liClass })"
      @click="click(item)"
    >
      <Item
        :is="item"
        :class="styles.item({ class: itemClass })"
        @action="emit('action', $event)"
      />
    </li>
  </ul>
</template>
