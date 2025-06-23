<script setup lang="ts">
import { contentEditableRef, inReplyTos } from '~/store'
import type { MessageStatus } from '~~/db/schema'

const props = defineProps<{
  right: boolean
  messageId: number
  messageFrom: 'user' | 'bot'
  messageStatus: MessageStatus
  messageContent: string
}>()

const route = useRoute()
const username = computed(() => route.params.username as string)

const characterQuery = useCharacterQuery(username)
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
      class="hidden group-hover:flex btn btn-sm btn-circle btn-neutral"
      icon="material-symbols:reply-rounded"
      icon-class="text-xl"
      @click="handleReply"
    />
  </div>
</template>
