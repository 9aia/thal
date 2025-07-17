<script setup lang="ts">
definePageMeta({
  layout: 'common-sidebar-left',
  middleware: ['chat', 'premium'],
  pageTransitionType: 'fade-up',
})

const route = useRoute()
const username = computed(() => route.params.username as string)

const characterQuery = useCharacterQuery(username, {
  initialData: route.meta.character,
})
const usernameNotFound = computed(() => !characterQuery.data.value?.usernameId)
</script>

<template>
  <div class="flex flex-col h-dvh justify-center items-center bg-white absolute w-full">
    <ChatHeader />
    <ReleaseBanner />

    <ChatBody />

    <ChatFooter v-if="characterQuery.data.value && !usernameNotFound" />
  </div>
</template>
