<script setup lang="ts">
definePageMeta({
  layout: 'common-sidebar-left',
  middleware: 'premium',
  pageTransitionType: 'fade-in-out',
})

const route = useRoute()
const username = computed(() => route.params.username as string)

const receiverUsernameNotFound = useReceiverUsernameNotFound()
const characterQuery = useCharacterQuery(username)
</script>

<template>
  <div class="flex flex-col h-dvh justify-center items-center bg-white absolute w-full">
    <ChatHeader />

    <ChatBody />

    <ChatFooter v-if="characterQuery.data.value && !receiverUsernameNotFound" />
  </div>
</template>
