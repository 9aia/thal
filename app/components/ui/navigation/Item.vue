<script setup lang="ts">
import { t } from '@psitta/vue'
import MenuItem from './MenuItem.vue'
import type { MenuItemType } from './types'

const props = defineProps<{
  is: MenuItemType
}>()

const emit = defineEmits<{
  (e: 'action', emitValue: string): void
}>()

function handleSubmit(event: Event) {
  event.preventDefault()

  props.is.onSubmit && props.is.onSubmit(event)
}
</script>

<template>
  <template v-if="!!is.onClick">
    <button
      class="cursor-pointer flex w-full justify-between items-center"
      @click="is.onClick"
    >
      <MenuItem :is="is">
        <template #title>
          <slot name="title" />
        </template>
        <template #description>
          <slot name="description" />
        </template>
      </MenuItem>
    </button>
  </template>

  <template v-else-if="is.action">
    <form
      :action="is.action" :method="is.method" class="flex w-full"
      v-on="{ submit: !!is.onSubmit ? handleSubmit : undefined }"
    >
      <button
        type="submit"
        class="cursor-pointer flex w-full justify-between items-center"
      >
        <MenuItem :is="is">
          <template #title>
            <slot name="title" />
          </template>
          <template #description>
            <slot name="description" />
          </template>
        </MenuItem>
      </button>
    </form>
  </template>
  <template v-else-if="is.for">
    <label
      :for="is.for"
      class="cursor-pointer flex w-full justify-between items-center"
    >
      <MenuItem :is="is">
        <template #title>
          <slot name="title" />
        </template>
        <template #description>
          <slot name="description" />
        </template>
      </MenuItem>
    </label>
  </template>

  <template v-else-if="is.emit">
    <div
      class="flex w-full justify-between items-center"
      @click="emit('action', is.emit)"
    >
      <MenuItem :is="is">
        <template #title>
          <slot name="title" />
        </template>
        <template #description>
          <slot name="description" />
        </template>
      </MenuItem>
    </div>
  </template>

  <template v-else>
    <A
      :href="is.href ? t(is.href as any) : undefined"
      class="cursor-pointer flex w-full gap-2 justify-between items-center py-2"
      :target="is.newTab ? '_blank' : undefined" :localize="is.localize ?? true"
    >
      <MenuItem :is="is">
        <template #title>
          <slot name="title" />
        </template>
        <template #description>
          <slot name="description" />
        </template>
      </MenuItem>
    </A>
  </template>
</template>
