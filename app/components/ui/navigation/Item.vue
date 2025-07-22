<script setup lang="ts">
import { t } from '@psitta/vue'
import { tv } from 'tailwind-variants'
import MenuItem from './MenuItem.vue'
import type { MenuItemType } from './types'

const props = defineProps<{
  is: MenuItemType
  class?: string
}>()

const emit = defineEmits<{
  (e: 'action', emitValue: string): void
}>()

function handleSubmit(event: Event) {
  event.preventDefault()

  props.is.onSubmit && props.is.onSubmit(event)
}

const baseStyles = tv({
  slots: {
    button: 'cursor-pointer flex w-full text-left',
    label: 'cursor-pointer flex w-full justify-between items-center text-left',
    a: 'cursor-pointer flex w-full gap-2 justify-between items-center text-left',
    div: 'group flex w-full justify-between items-center text-left',
  },
})
const styles = baseStyles()
</script>

<template>
  <template v-if="!!is.onClick">
    <button
      :class="styles.button({ class: props.class })"
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
      :action="is.action" :method="is.method"
      class="flex min-w-full"
      v-on="{ submit: !!is.onSubmit ? handleSubmit : undefined }"
    >
      <button
        type="submit"
        :class="styles.button({ class: props.class })"
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
      :class="styles.label({ class: props.class })"
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
      tabindex="0"
      :class="styles.div({ class: props.class })"
      @click.stop="emit('action', is.emit)"
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
      :class="styles.a({ class: props.class })"
      :target="is.newTab ? '_blank' : undefined"
      :localize="is.localize ?? true"
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
