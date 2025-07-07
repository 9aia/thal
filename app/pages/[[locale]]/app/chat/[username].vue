<script setup lang="ts">
definePageMeta({
  layout: 'common-sidebar-left',
  middleware: 'premium',
  pageTransitionType: 'fade-in-out',
})

const route = useRoute()
const username = computed(() => route.params.username as string)
const { t } = useI18nExperimental()

const receiverUsernameNotFound = useReceiverUsernameNotFound()
const characterQuery = useCharacterQuery(username)

useSeoMeta({
  // HTML tags
  title: () => t('Talk to "{name}" thal. Learn English.', { name: characterQuery.data.value?.name }),
  description: () => t('Get translations, corrections, and listening while chatting. Try it for free to level up your English.'),

  // Facebook tags
  ogTitle: () => t('Talk to "{name}" thal. Learn English.', { name: characterQuery.data.value?.name }),
  ogDescription: () => t('Get translations, corrections, and listening while chatting. Try it for free to level up your English.'),

  // Twitter tags
  twitterTitle: () => t('Talk to "{name}" thal. Learn English.', { name: characterQuery.data.value?.name }),
  twitterDescription: () => t('Get translations, corrections, and listening while chatting. Try it for free to level up your English.'),
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-center items-center bg-white absolute w-full">
    <ChatHeader />

    <ChatBody />

    <ChatFooter v-if="characterQuery.data.value && !receiverUsernameNotFound" />
  </div>
</template>
