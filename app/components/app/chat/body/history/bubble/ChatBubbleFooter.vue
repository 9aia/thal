<script setup lang="ts">
import type { Mutation } from '@tanstack/vue-query'
import { useQueryClient } from '@tanstack/vue-query'
import { tv } from 'tailwind-variants'
import type AudibleText from '~/components/app/ai/AudibleText.vue'
import queryKeys from '~/queryKeys'
import { edition, inReplyTos } from '~/store'
import type { MessageCorrectionData } from '~/types'
import { type InReplyTo, MessageStatus } from '~~/db/schema'

const props = defineProps<{
  messageContent: string
  messageId: number
  messageFrom: 'user' | 'bot'
  messageStatus: MessageStatus
  messageCorrection?: MessageCorrectionData
  inReplyTo?: InReplyTo
  translation: Translation
  isEditing: boolean
  isLast: boolean
  right: boolean
}>()

const route = useRoute()
const username = computed(() => route.params.username as string)

const queryClient = useQueryClient()

const characterQuery = useCharacterQuery(username)
const historyQuery = useHistoryQuery(username)

const queryPromises = [
  historyQuery.suspense(),
  characterQuery.suspense(),
]

await Promise.all(queryPromises)

const sendMessageMutation = useSendMessage(username)
const historyClient = useHistoryClient(username)
const chatClient = useChatClient(username)
const copyToClipboard = useClipboard(toRef(() => props.messageContent))
const isCharacterDeleted = computed(() => !characterQuery.data.value?.id)

type AudibleTextType = InstanceType<typeof AudibleText>
const audiableTextRef = defineModel<AudibleTextType | null>('audiable-text')

const isAnalysisModalOpen = ref(false)

const lastMessage = computed(() => {
  if (!historyQuery.data.value) {
    return null
  }

  return historyQuery.data.value[historyQuery.data.value.length - 1]
})

const isLastMessageError = computed(() => {
  return lastMessage.value?.status === MessageStatus.error
})

const messageSeverity = computed(() => {
  if (props.messageCorrection?.severity) {
    return props.messageCorrection.severity
  }

  return null
})

const isMessageWrong = computed(() => {
  return props.messageCorrection?.status === 'needs_correction'
})

async function handleEdit() {
  edition.messageId = props.messageId
  await nextTick()
  edition.content = props.messageContent
  edition.inReplyTo = props.inReplyTo
}

function handleResend() {
  historyClient.deleteMessage(props.messageId)
  chatClient.deleteLastMessage()

  // No need to reset inReplyTo because it's a retry
  // No need to reset sendMessage cache mutations because it's a retry

  sendMessageMutation.mutate({
    time: now().getTime(),
    content: props.messageContent,
    inReplyTo: props.inReplyTo,
  })
}

function handleDelete() {
  historyClient.deleteMessage(props.messageId)
  chatClient.deleteLastMessage()

  // Exit edition
  edition.messageId = undefined
  edition.content = ''
  edition.inReplyTo = undefined

  // Delete message from inReplyTo if it's this message
  const _username = toValue(username)
  if (inReplyTos[_username]?.id === props.messageId) {
    delete inReplyTos[_username]
  }

  // Reset sendMessage cache mutations
  const mutations = queryClient.getMutationCache().findAll({
    status: 'error',
    mutationKey: queryKeys.messageSend(username),
  })

  mutations.forEach((mutation: Mutation) => {
    queryClient.getMutationCache().remove(mutation)
  })
}

const messageFeedbackIcon = tv({
  base: 'text-xl',
  variants: {
    severity: {
      minor: 'text-brown-500',
      moderate: 'text-orange-500',
      major: 'text-red-500',
    },
  },
})
</script>

<template>
  <div class="opacity-100 flex items-center mt-1">
    <div class="flex items-center min-h-8">
      <Button
        v-if="(messageFrom === 'user') && isLast && isLastMessageError && !isEditing"
        class="btn btn-sm btn-circle btn-ghost btn-primary group-hover:opacity-100! group-focus-within:opacity-100"
        :class="{ 'fine:opacity-0': !isLast }"
        icon="material-symbols:edit-outline-rounded"
        icon-class="text-xl"
        @click="handleEdit"
      />

      <Button
        v-if="(messageFrom === 'user') && isLast && isLastMessageError && !isEditing"
        class="btn btn-sm btn-circle btn-ghost btn-secondary group-hover:opacity-100! group-focus-within:opacity-100"
        :class="{ 'fine:opacity-0': !isLast }"
        icon="material-symbols:refresh-rounded"
        icon-class="text-xl"
        @click="handleResend"
      />

      <Button
        v-if="!isEditing"
        class="btn btn-sm btn-circle btn-ghost btn-neutral group-hover:opacity-100! group-focus-within:opacity-100"
        :class="{ 'fine:opacity-0': !isLast }"
        icon="material-symbols:content-copy-outline-rounded"
        icon-class="text-xl"
        @click="copyToClipboard()"
      />

      <Button
        v-if="!isEditing && messageStatus !== MessageStatus.error"
        class="btn btn-sm btn-circle btn-ghost btn-neutral group-hover:opacity-100! group-focus-within:opacity-100"
        :no-disable-on-loading="audiableTextRef?.speech.hasDataFetched.value"
        :loading="audiableTextRef?.playMutation.isPending.value"
        :class="{ 'fine:opacity-0': !isLast }"
        icon="material-symbols:volume-up-outline-rounded"
        icon-class="text-xl"
        @click="audiableTextRef?.playMutation.mutate()"
      />

      <Button
        v-if="!isEditing && messageStatus !== MessageStatus.error"
        class="btn btn-circle btn-sm btn-ghost btn-neutral group-hover:opacity-100! group-focus-within:opacity-100"
        :loading="translation.isLoading.value"
        :disabled="isCharacterDeleted"
        :class="{ 'fine:opacity-0': !isLast }"
        icon="material-symbols:translate-rounded"
        icon-class="text-xl"
        @click="translation.onTranslate()"
      />

      <Button
        v-if="(messageFrom === 'user') && isLast && isLastMessageError"
        class="btn btn-sm btn-circle btn-ghost btn-error group-hover:opacity-100! group-focus-within:opacity-100"
        :class="{ 'fine:opacity-0': !isLast }"
        icon="material-symbols:delete-outline-rounded"
        icon-class="text-xl"
        @click="handleDelete"
      />

      <Button
        v-if="messageFrom === 'user' && isMessageWrong"
        class="btn btn-sm btn-circle btn-ghost btn-neutral group-hover:opacity-100! group-focus-within:opacity-100"
        icon="material-symbols:info-outline-rounded"
        :class="{ 'fine:opacity-0': false }"
        :icon-class="messageFeedbackIcon({ severity: messageSeverity || 'moderate' })"
        @click="isAnalysisModalOpen = true"
      />

      <Button
        v-if="messageFrom === 'user' && !isMessageWrong && !sendMessageMutation.isPending.value && sendMessageMutation.isError.value"
        class="btn btn-sm btn-circle btn-ghost btn-neutral group-hover:opacity-100! group-focus-within:opacity-100"
        icon="material-symbols:auto-awesome-outline-rounded"
        :class="{ 'fine:opacity-0': !isLast }"
        icon-class="text-xl"
        @click="isAnalysisModalOpen = true"
      />
    </div>
  </div>

  <LazyMessageAnalysisModal
    v-if="isAnalysisModalOpen && !sendMessageMutation.isError.value && !sendMessageMutation.isPending.value"
    v-model="isAnalysisModalOpen"
    :message-id="messageId"
    :message="messageContent"
    :message-correction="messageCorrection"
  />
</template>

<style lang="css" scoped>
@reference '~/assets/css/main.css';

@media (pointer: fine) {
  .fine\:opacity-0 {
    opacity: 0;
  }
}
</style>
