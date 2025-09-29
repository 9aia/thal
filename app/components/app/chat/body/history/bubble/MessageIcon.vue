<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { MessageStatus } from '~~/server/db/schema'

const props = defineProps<{
  status: MessageStatus
  class?: string
}>()

const icon = computed(() => {
  const icons: Record<string, string> = ({
    [MessageStatus.sending.toString()]: 'material-symbols:schedule-outline-rounded',
    [MessageStatus.seen.toString()]: 'material-symbols:done-all-rounded',
    [MessageStatus.received.toString()]: 'material-symbols:done-all-rounded',
    [MessageStatus.sent.toString()]: 'material-symbols:check-rounded',
    [MessageStatus.error.toString()]: 'material-symbols:error-outline-rounded',
  })

  return icons[props.status.toString()]
})

const styles = tv({
  base: 'text-base',
  variants: {
    type: {
      [MessageStatus.error.toString()]: 'text-red-500',
      [MessageStatus.seen.toString()]: 'text-blue-500',
      [MessageStatus.sending.toString()]: 'text-gray-500',
      [MessageStatus.received.toString()]: 'text-gray-500',
      [MessageStatus.sent.toString()]: 'text-gray-500',
    },
  },
})
</script>

<template>
  <Icon
    :name="icon"
    :class="styles({ class: props.class, type: props.status.toString() })"
  />
</template>
