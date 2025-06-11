<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { MessageStatus } from '~/types'

const props = defineProps<{
  status: MessageStatus
  class?: string
}>()

const icon = computed(() => {
  let icon: string

  switch (props.status) {
    case 'sending':
      icon = 'material-symbols:schedule-outline'
      break
    case 'seen':
      icon = 'material-symbols:done-all'
      break
    case 'received':
      icon = 'material-symbols:done-all'
      break
    case 'sent':
      icon = 'material-symbols:check-rounded'
      break
    case 'error':
      icon = 'material-symbols:error-outline'
      break
  }

  return icon
})

const styles = tv({
  base: 'text-base',
  variants: {
    type: {
      error: 'text-red-500',
      seen: 'text-blue-500',
      sending: 'text-gray-500',
      received: 'text-gray-500',
      sent: 'text-gray-500',
    },
  },
})
</script>

<template>
  <Icon
    :name="icon"
    :class="styles({ class: props.class, type: props.status })"
  />
</template>
