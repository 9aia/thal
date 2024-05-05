<script setup lang="ts">
import { tv, type VariantProps } from 'tailwind-variants';
import type { SafeVariantProps } from '~/src/base/utils/types';
import { Popover } from '@ark-ui/vue'

const styles = tv({
  base: 'bg-base-100 outline-teal-500 shadow-xl p-2 rounded-lg',
})

defineProps<SafeVariantProps<VariantProps<typeof styles>>>()

const open = defineModel({
  default: false
})
</script>

<template>
  <ClientOnly>
    <Popover.Root v-model:open="open">
      
      <Popover.Anchor>
        <slot name="anchor" />
      </Popover.Anchor>

      <Popover.Positioner>
        <Popover.Content :class="styles()">
          <slot name="content" />

        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>

    <template #fallback>
      <slot name="anchor" />
    </template>
  </ClientOnly>
</template>