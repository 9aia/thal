<script setup lang="ts">
import { A } from "#framework/i18n";
import NavbarMenuItem from "./NavbarMenuItem.vue";
import { NavbarMenuItem as NavbarMenuItemType } from "./types";

defineProps<{
  items: NavbarMenuItemType[];
}>();

const closeMenu = () => {
  const elem = document.activeElement as any;

  if (elem) {
    elem?.blur();
  }
};
</script>

<template>
  <ul
    tabindex="0"
    class="menu menu-sm dropdown-content mt-3 z-[1] p-2 space-y-2 shadow bg-base-100 rounded-box w-52"
  >
    <li v-for="item in items" @click="closeMenu">
      <template v-if="item.action">
        <form action="/api/auth/logout" method="POST" class="flex w-full py-2">
          <button
            type="submit"
            class="flex w-full gap-2 justify-between items-center"
          >
            <NavbarMenuItem :is="item" />
          </button>
        </form>
      </template>

      <template v-else>
        <A
          :href="item.href"
          class="flex w-full gap-2 justify-between items-center py-2"
        >
          <NavbarMenuItem :is="item" />
        </A>
      </template>
    </li>
  </ul>
</template>
