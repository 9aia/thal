<script setup lang="ts">
import queryKeys from '~/queryKeys'

defineProps<{
  chatId: number
}>()

const route = useRoute()
const username = computed(() => route.params.username as string)
const headers = useRequestHeaders(['cookie'])

const characterQuery = useCharacterQuery(username)

const contactQuery = useServerQuery({
  queryKey: queryKeys.contact(username),
  queryFn: () => $fetch(`/api/contact/${username.value}` as `/api/contact/:username`, {
    headers,
  }),
})

const isContact = computed(() => !!contactQuery.data.value?.id)
const contactNames = computed(() => getContactName({
  username: username.value,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))

const historyQuery = useServerQuery({
  queryKey: queryKeys.chatHistory(username),
  queryFn: () => $fetch(`/api/chat/history/${username.value}` as `/api/chat/history/:username`),
  enabled: computed(() => !!username.value),
})

const hasMessages = computed(() => !!historyQuery.data.value?.length)
</script>

<template>
  <div class="w-full h-full sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto">
    <NonContactProfileCard
      v-if="!isContact"
      :avatar-name="contactNames.avatarName"
      :display-name="contactNames.displayName"
      :description="characterQuery.data.value!.description"
      :username="username"
      class="mb-4"
    />

    <ExperimentalAlert />

    <div v-if="hasMessages" class="mt-6">
      <History :chat-id="chatId" />
    </div>

    <div class="sticky bottom-0 right-0 flex justify-end">
      <GoToBottomButton />
    </div>
  </div>
</template>
