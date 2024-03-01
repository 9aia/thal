<script setup lang="ts">
import MenuItem from './MenuItem.vue'
import type { MenuItem as MenuItemType } from './types'
import { t } from '#lib/i18n'
import A from '#lib/vike/components/A.vue'

defineProps<{
  is: MenuItemType
}>()
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
      :href="is.href ? t(is.href as any) : undefined"
      class="flex w-full gap-2 justify-between items-center py-2"
      :target="is.newTab ? '_blank' : undefined"
      :localize="is.localize ?? true"
    >
      <MenuItem :is="is" />
    </A>
  </template>
</template>
