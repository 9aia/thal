<script setup lang="ts">
import { Accordion } from '@ark-ui/vue'

defineProps<{
  value: string
}>()

const modelValue = defineModel<string>('value', { required: true })
</script>

<template>
  <Accordion.Item :value="modelValue" class="w-full overflow-hidden">
    <Accordion.ItemTrigger class="peer cursor-pointer w-full flex justify-between border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none group">
      <div class="flex gap-4 items-start">
        <slot name="header">
          <slot name="title" />
          <slot name="description" />
        </slot>
      </div>

      <Accordion.ItemIndicator>
        <Icon name="material-symbols:chevron-right-rounded" class="text-black rotate-90 transition-transform duration-300 group-data-[state=open]:-rotate-90" />
      </Accordion.ItemIndicator>
    </Accordion.ItemTrigger>

    <Accordion.ItemContent class="pt-4 w-full">
      <slot />
    </Accordion.ItemContent>
  </Accordion.Item>
</template>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0.01;
    height: 0;
  }
  to {
    opacity: 1;
    height: var(--height);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    height: var(--height);
  }
  to {
    opacity: 0.01;
    height: 0;
  }
}

[data-scope='accordion'][data-part='item-content'][data-state='open'] {
  animation: slideDown 250ms ease-in-out;
}

[data-scope='accordion'][data-part='item-content'][data-state='closed'] {
  animation: slideUp 200ms ease-in-out;
}
</style>
