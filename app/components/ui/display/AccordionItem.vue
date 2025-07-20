<script setup lang="ts">
import { AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from 'reka-ui'

defineProps<{
  value: string
}>()
</script>

<template>
  <AccordionItem
    :value="value"
    :unmount-on-hide="false"
    class="w-full"
  >
    <AccordionHeader>
      <AccordionTrigger class="peer py-3 cursor-pointer w-full flex justify-between border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none group">
        <div class="flex gap-4 items-start">
          <slot name="header">
            <slot name="title" />
            <slot name="description" />
          </slot>
        </div>

        <Icon
          name="material-symbols:chevron-right-rounded"
          class="text-black rotate-90 transition-transform duration-300 group-data-[state=open]:-rotate-90"
        />
      </AccordionTrigger>
    </AccordionHeader>

    <AccordionContent
      class="pt-3 pb-2 w-full relative z-0 data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down-opacity data-[state=closed]:animate-slide-up-opacity"
    >
      <slot />
    </AccordionContent>
  </AccordionItem>
</template>
