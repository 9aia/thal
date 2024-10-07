<script setup lang="ts">
import { tv } from "tailwind-variants"
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
    case "error":
      icon = "error"
      break
  }

  return icon
})

const styles = tv({
  variants: {
    type: {
      error: "text-red-600",
      seen: "text-sky-500",
      sending: "text-slate-500",
      received: "text-slate-500",
      sent: "text-slate-500",
    },
  },
})
</script>

<template>
  <Icon
    :name="icon"
    :class="styles({ type: props.status })"
    style="font-size: 1.15rem"
  />
</template>
