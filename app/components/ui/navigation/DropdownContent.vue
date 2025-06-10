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
    base: 'dropdown-content bg-base-100 rounded-2xl z-1 w-56 p-4 shadow-2xl mt-3 overflow-visible space-y-2',
    li: '',
    item: 'flex px-2 w-full rounded-2xl focus:outline-2 focus:outline-offset-2 focus:outline-blue-500',
  },
})

const styles = baseStyles()
</script>

<template>
  <ul
    tabindex="0"
    :class="styles.base({ class: props.class })"
  >
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
  </ul>
</template>
