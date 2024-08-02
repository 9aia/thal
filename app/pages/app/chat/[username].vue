<script setup lang="ts">
import AppLayout from "~/layouts/app.vue"
import type { Message } from "~/types"

definePageMeta({
  layout: false,
})

const route = useRoute()
const params = route.params

const {
  data,
  isLoading,
  isError,
  refetch,
} = await useServerQuery(() => `/api/contact/${params.username}`, {
  queryKey: ["chat", computed(() => params.username)],
})

const chats: Message[] = [
  {
    id: "1",
    from: "user",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "user",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
]
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <Home />
    </template>

    <template #content>
      <Resource
        :loading="isLoading"
        :error="isError"
        @execute="refetch"
      >
        <ChatHeader
          :name="data?.name"
        />

        <ChatConversation :chats="chats" class="flex-1 overflow-y-auto" />

        <ChatFooter />
      </Resource>
    </template>
  </AppLayout>
</template>
