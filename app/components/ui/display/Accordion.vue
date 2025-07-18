<script setup lang="ts">
import { Accordion } from '@ark-ui/vue'

const value = defineModel<string>('value', { required: true })
</script>

<template>
  <Accordion.Item :value="value" class="collapse w-full" :class="{ 'collapse-open': value === value }">
    <Accordion.ItemTrigger class="flex justify-between">
      <div class="flex gap-4 items-start cursor-pointer">
        <slot name="header">
          <slot name="title" />
          <slot name="description" />
        </slot>
      </div>

      <Accordion.ItemIndicator>
        <Icon name="material-symbols:chevron-right-rounded" class="text-black rotate-90" />
      </Accordion.ItemIndicator>
    </Accordion.ItemTrigger>

    <Accordion.ItemContent class="collapse-content">
      <slot />
    </Accordion.ItemContent>
  </Accordion.Item>
</template>
