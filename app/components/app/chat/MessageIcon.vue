<script setup lang="ts">
import type { MessageStatus } from "~/types"

const props = defineProps<{
  status: MessageStatus
}>()

const icon = computed(() => {
  let icon: string

  switch (props.status) {
    case "sending":
      icon = "schedule"
      break
    case "seen":
      icon = "done_all"
      break
    case "received":
      icon = "done_all"
      break
    case "sent":
      icon = "check"
      break
  }

  return icon
})
</script>

<template>
  <Icon :name="icon" :class="[status === 'seen' ? 'text-sky-500' : 'text-slate-500']" style="font-size: 1.15rem" />
</template>
