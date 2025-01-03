<script setup lang="ts">
import type { MenuItem as MenuItemType } from './types'
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
    class="menu menu-sm p-2 dropdown-content overflow-hidden mt-3 z-[1] shadow bg-base-100 rounded-box w-52"
  >
    <li v-for="item in items" :key="item.id" class="group w-full h-full" @click="closeMenu">
      <Item
        :is="item"
        :class="itemClass"
        @action="emit('action', $event)"
      />
    </li>
  </ul>
</template>
