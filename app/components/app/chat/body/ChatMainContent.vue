<script setup lang="ts">
const route = useRoute()
const username = computed(() => route.params.username as string)
const { isScrollDownButtonVisible } = useChatMainScroll()

const historyQuery = useHistoryQuery(username)
const characterQuery = useCharacterQuery(username)
const contactQuery = useContactQuery(username)

const queryPromises = [
  historyQuery.suspense(),
  characterQuery.suspense(),
  contactQuery.suspense(),
]

await Promise.all(queryPromises)

const isContact = computed(() => !!contactQuery.data.value?.id)
const contactNames = computed(() => getContactName({
  username: username.value,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))
const hasMessages = computed(() => !!historyQuery.data.value?.length)
</script>

<template>
  <div class="w-full h-full sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto">
    <NonContactProfileCard
      v-if="!isContact"
      :avatar-name="contactNames.avatarName"
      :display-name="contactNames.displayName"
      :description="characterQuery.data.value?.description || undefined"
      :username="username"
      class="mb-4"
    />

    <div v-if="hasMessages" class="mt-6">
      <History />
    </div>

    <div class="sticky bottom-0 z-50 w-fit float-right" :class="{ 'pointer-events-none': !isScrollDownButtonVisible }">
      <ChatMainScrollBottomButton />
    </div>
  </div>
</template>
