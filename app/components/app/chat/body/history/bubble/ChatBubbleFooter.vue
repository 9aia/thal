<script setup lang="ts">
import type AudibleText from '~/components/app/ai/AudibleText.vue'
import { edition } from '~/store'
import { type InReplyTo, MessageStatus } from '~~/db/schema'

const props = defineProps<{
  messageContent: string
  messageId: number
  messageFrom: 'user' | 'bot'
  messageStatus: MessageStatus
  inReplyTo?: InReplyTo
  translation: Translation
  isEditing: boolean
  isLast: boolean
  right: boolean
}>()

const route = useRoute()
const username = computed(() => route.params.username as string)

const characterQuery = useCharacterQuery(username)
const historyQuery = useHistoryQuery(username)

const copyToClipboard = useClipboard(toRef(() => props.messageContent))
const isCharacterDeleted = computed(() => !characterQuery.data.value?.id)

type AudibleTextType = InstanceType<typeof AudibleText>
const audiableTextRef = defineModel<AudibleTextType | null>('audiable-text')

const isLastMessageError = computed(() => {
  if (!historyQuery.data.value) {
    return false
  }

  if (historyQuery.data.value.length === 0) {
    return false
  }

  const lastMessage = historyQuery.data.value[historyQuery.data.value.length - 1]
  return lastMessage.status === MessageStatus.error
})

async function handleEdit() {
  edition.editingMessageId = props.messageId
  await nextTick()
  edition.content = props.messageContent
  edition.inReplyTo = props.inReplyTo
}

function handleResend() {
  // TODO: resend message
  console.log('resend')
}

function handleDelete() {
  // TODO: delete message
  console.log('delete')

  //   queryClient.setQueryData(
  //     queryKeys.chat(username),
  //     (oldData: Message[]) => oldData.filter(message => message.id !== messageId),
  //   )

//   if (shouldInvalidateChat) {
//     queryClient.invalidateQueries({
//       queryKey: queryKeys.chats,
//     })
//   }
}
</script>

<template>
  <div class="chat-footer opacity-90 flex items-center mt-1" :class="{ 'flex-row-reverse': !right }">
    <div class="flex items-center min-h-8" :class="{ 'flex-row-reverse': !right }">
      <Button
        v-if="(messageFrom === 'user') && isLast && isLastMessageError && !isEditing"
        class="btn btn-sm btn-circle btn-ghost btn-primary group-hover:opacity-100 group-focus-within:opacity-100"
        :class="{ 'sm:opacity-0': !isLast }"
        icon="material-symbols:edit-outline-rounded"
        icon-class="text-xl"
        @click="handleEdit"
      />

      <Button
        v-if="(messageFrom === 'user') && isLast && isLastMessageError && !isEditing"
        class="btn btn-sm btn-circle btn-ghost btn-secondary group-hover:opacity-100 group-focus-within:opacity-100"
        :class="{ 'sm:opacity-0': !isLast }"
        icon="material-symbols:refresh-rounded"
        icon-class="text-xl"
        @click="handleResend"
      />

      <Button
        v-if="!isEditing"
        class="btn btn-sm btn-circle btn-ghost btn-neutral group-hover:opacity-100 group-focus-within:opacity-100"
        :class="{ 'sm:opacity-0': !isLast }"
        icon="material-symbols:content-copy-outline-rounded"
        icon-class="text-xl"
        @click="copyToClipboard"
      />

      <Button
        v-if="!isEditing && messageStatus !== MessageStatus.error"
        class="btn btn-sm btn-circle btn-ghost btn-neutral group-hover:opacity-100 group-focus-within:opacity-100"
        no-disable-on-loading
        :loading="audiableTextRef?.playMutation.isPending.value"
        :class="{ 'sm:opacity-0': !isLast }"
        icon="material-symbols:volume-up-outline-rounded"
        icon-class="text-xl"
        @click="audiableTextRef?.playMutation.mutate()"
      />

      <Button
        v-if="!isEditing && messageStatus !== MessageStatus.error"
        class="btn btn-circle btn-sm btn-ghost btn-neutral group-hover:opacity-100 group-focus-within:opacity-100"
        :loading="translation.isLoading.value"
        :disabled="isCharacterDeleted"
        :class="{ 'sm:opacity-0': !isLast }"
        icon="material-symbols:translate-rounded"
        icon-class="text-xl"
        @click="translation.onTranslate()"
      />

      <Button
        v-if="(messageFrom === 'user') && isLast && isLastMessageError"
        class="btn btn-sm btn-circle btn-ghost btn-error group-hover:opacity-100 group-focus-within:opacity-100"
        :class="{ 'sm:opacity-0': !isLast }"
        icon="material-symbols:delete-outline-rounded"
        icon-class="text-xl"
        @click="handleDelete"
      />
    </div>
  </div>
</template>
