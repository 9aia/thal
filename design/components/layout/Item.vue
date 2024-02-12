<script setup lang="ts">
import { A } from "#framework/i18n";
import MenuItem from "./MenuItem.vue";
import { MenuItem as MenuItemType } from "./types";

defineProps<{
  is: MenuItemType;
}>();
</script>

<template>

  <template v-if="is.action">
    <form :action="is.action" :method="is.method" class="flex w-full py-2">
      <button
        type="submit"
        class="flex w-full gap-2 justify-between items-center"
      >
        <MenuItem :is="is" />
      </button>
    </form>
  </template>
  
  <template v-else>
    <A
      :href="is.href"
      class="flex w-full gap-2 justify-between items-center py-2"
      :target="is.newTab ? '_blank' : undefined"
    >
      <MenuItem :is="is" />
    </A>
  </template>
</template>
