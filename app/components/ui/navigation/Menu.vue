<script setup lang="ts">
import type { MenuItemType } from './types'
import Item from './Item.vue'

defineProps<{
  items: MenuItemType[]
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
</script>

<template>
  <ul
    tabindex="0"
    class="px-3 menu menu-sm dropdown-content overflow-hidden mt-3 shadow-2xl bg-base-100 rounded-2xl w-56"
  >
    <li
      v-for="item in items"
      :key="item.id"
      class="w-full h-full px-0 py-0 hover:bg-base-200/80 rounded-full"
      @click="closeMenu"
    >
      <Item
        :is="item"
        :class="itemClass"
        class="hover:bg-transparent flex w-full"
        @action="emit('action', $event)"
      />
    </li>
  </ul>
</template>
