<script setup lang="ts">
import Item from "./Item.vue";
import { MenuItem as MenuItemType } from "./types";

defineProps<{
  items: MenuItemType[];
}>();

const closeMenu = () => {
  const elem = document.activeElement as any;

  if (elem) {
    elem?.blur();
  }
};
</script>

<template>
  <ul tabindex="0" class="rounded-box w-full divide-y divide-base-200">
    <li v-for="item in items" @click="closeMenu" class="group">
      <div
        class="px-2 rounded-lg hover:bg-base-200"
      >
        <Item :is="item" />
      </div>
    </li>
  </ul>
</template>
