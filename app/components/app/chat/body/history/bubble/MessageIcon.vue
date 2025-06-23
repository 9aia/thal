<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { MessageStatus } from '~~/db/schema'

const props = defineProps<{
  status: MessageStatus
  class?: string
}>()

const icon = computed(() => {
  const icons: Record<number, string> = ({
    [MessageStatus.sending]: 'material-symbols:schedule-outline-rounded',
    [MessageStatus.seen]: 'material-symbols:done-all-rounded',
    [MessageStatus.received]: 'material-symbols:done-all-rounded',
    [MessageStatus.sent]: 'material-symbols:check-rounded',
    [MessageStatus.error]: 'material-symbols:error-outline-rounded',
  })

  return icons[props.status]
})

const styles = tv({
  base: 'text-base',
  variants: {
    type: {
      [MessageStatus.error]: 'text-red-500',
      [MessageStatus.seen]: 'text-blue-500',
      [MessageStatus.sending]: 'text-gray-500',
      [MessageStatus.received]: 'text-gray-500',
      [MessageStatus.sent]: 'text-gray-500',
    },
  },
})
</script>

<template>
  <Icon
    :name="icon"
    :class="styles({ class: props.class, type: props.status as number })"
  />
</template>
