<script setup lang="ts">
import AppLayout from '~/layouts/app.vue'
import queryKeys from '~/queryKeys'

definePageMeta({
  layout: false,
  middleware: 'premium',
})

useAutoRedirect()

const route = useRoute()

const username = computed(() => route.params.username as string)

const text = ref('')
const characterNotFound = useState('characterNotFound', () => false)

const headers = useRequestHeaders(['cookie'])
const chatQuery = useServerQuery({
  queryKey: queryKeys.chat(username),
  queryFn: () => $fetch(`/api/chat/${username.value}` as `/api/chat/:username`, {
    headers,
  }),
})

const OPTIMISTIC_CHAT_ID = -1
const chatId = computed(() => chatQuery.data.value?.id || OPTIMISTIC_CHAT_ID)
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <ChatListDrawer />
    </template>

    <template #content>
      <div class="flex flex-col h-dvh justify-center items-center bg-white">
        <ChatHeader />

        <!-- <ChatBody /> -->

        <ChatFooter
          v-if="!characterNotFound"
          v-model="text"
          :chat-id="chatId"
        />
      </div>
    </template>
  </AppLayout>
</template>
