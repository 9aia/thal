<script setup lang="ts">
import type { MenuItem as MenuItemType } from './types'

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
  <ul tabindex="0" class="rounded-box w-full divide-y divide-base-100">
    <li v-for="item in items" :key="item.id" class="group" @click="closeMenu">
      <div>
        <Item
          :is="item"
          :class="itemClass"
          @action="emit('action', $event)"
        />
      </div>
    </li>
    <slot name="footer" />
  </ul>
</template>
