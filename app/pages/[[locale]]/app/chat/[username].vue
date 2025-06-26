<script setup lang="ts">
import AppLayout from '~/layouts/app.vue'

definePageMeta({
  layout: false,
  middleware: 'premium',
})

useAutoRedirect()

const route = useRoute()
const username = computed(() => route.params.username as string)

const receiverUsernameNotFound = useReceiverUsernameNotFound()
const characterQuery = useCharacterQuery(username)
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <ChatListDrawer />
    </template>

    <template #content>
      <div class="flex flex-col h-dvh justify-center items-center bg-white">
        <ChatHeader />

        <ChatBody />

        <ChatFooter v-if="characterQuery.data.value && !receiverUsernameNotFound" />
      </div>
    </template>
  </AppLayout>
</template>
