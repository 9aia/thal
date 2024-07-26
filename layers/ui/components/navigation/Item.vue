<script setup lang="ts">
import { t } from "@psitta/vue"
import MenuItem from "../navigation/MenuItem.vue"
import type { MenuItem as MenuItemType } from "./types"

const props = defineProps<{
  is: MenuItemType
}>()

function handleSubmit(event: Event) {
  event.preventDefault()

  props.is.onSubmit && props.is.onSubmit(event)
}
</script>

<template>
  <template v-if="is.action">
    <form
      :action="is.action" :method="is.method" class="flex w-full"
      v-on="{ submit: !!is.onSubmit ? handleSubmit : undefined }"
    >
      <button type="submit" class="flex w-full py-2 justify-between items-center">
        <MenuItem :is="is" />
      </button>
    </form>
  </template>
  <template v-else-if="is.for">
    <label :for="is.for" class="cursor-pointer flex w-full py-2 justify-between items-center">
      <MenuItem :is="is" />
    </label>
  </template>

  <template v-else>
    <A
      :href="is.href ? t(is.href as any) : undefined" class="flex w-full gap-2 justify-between items-center py-2"
      :target="is.newTab ? '_blank' : undefined" :localize="is.localize ?? true"
    >
      <MenuItem :is="is" />
    </A>
  </template>
</template>
