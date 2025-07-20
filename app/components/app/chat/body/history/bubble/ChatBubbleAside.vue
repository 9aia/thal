<script setup lang="ts">
import { contentEditableRef, inReplyTos } from '~/store'
import type { MessageStatus } from '~~/db/schema'

const props = defineProps<{
  right: boolean
  messageId: number
  messageFrom: 'user' | 'bot'
  messageStatus: MessageStatus
  messageContent: string
  isLast: boolean
}>()

const route = useRoute()
const username = computed(() => route.params.username as string)

const characterQuery = useCharacterQuery(username)
await characterQuery.suspense()

const isCharacterDeleted = computed(() => !characterQuery.data.value?.id)

function handleReply() {
  inReplyTos[username.value] = {
    id: props.messageId,
    content: props.messageContent,
    from: props.messageFrom,
    status: props.messageStatus,
  }

  contentEditableRef.value?.focus()
}
</script>

<template>
  <div
    class="w-[108px] flex gap-1"
    :class="right ? 'flex-row-reverse' : 'flex-row'"
  >
    <Button
      :disabled="isCharacterDeleted"
      class="group-hover:opacity-100 group-focus-within:opacity-100 btn btn-sm btn-circle btn-neutral"
      :class="{ 'sm:opacity-0': !isLast }"
      icon="material-symbols:reply-rounded"
      icon-class="text-xl"
      @click="handleReply"
    />
  </div>
</template>
