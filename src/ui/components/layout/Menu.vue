<script setup lang="ts">
import Item from './Item.vue'
import type { MenuItem as MenuItemType } from './types'

defineProps<{
  items: MenuItemType[]
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
    class="menu menu-sm dropdown-content mt-3 z-[1] p-2 space-y-2 shadow bg-base-100 rounded-box w-52"
  >
    <li v-for="item in items" :key="item.id" class="group" @click="closeMenu">
      <Item :is="item" />
    </li>
  </ul>
</template>
