<script setup lang="ts">
import { Popover } from '@ark-ui/vue'
import { type VariantProps, tv } from 'tailwind-variants'
import type { SafeVariantProps } from '~~/shared/types'

defineProps<SafeVariantProps<VariantProps<typeof styles>>>()

const styles = tv({
  base: 'bg-base-100 outline-teal-500 shadow-xl p-2 rounded-lg',
})

const open = defineModel({
  default: false,
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
