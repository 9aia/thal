<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import AppLayout from "~/layouts/app.vue"
import type { Message } from "~/types"

definePageMeta({
  layout: false,
})

const route = useRoute()
const params = route.params
const queryClient = useQueryClient()

const {
  data,
  isLoading,
  isError,
  refetch,
} = await useServerQuery(() => `/api/contact/${params.username}`, {
  queryKey: ["chat", computed(() => params.username)],
})

const chatsData: Message[] = [
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

const chatQuery = useQuery({
  queryKey: ["messages", computed(() => params.username)],
  queryFn: () => {
    // return $fetch(`/api/chat/messages/${params.username}`)
    return new Promise<Message[]>((resolve) => {
      setTimeout(() => {
        resolve(chatsData)
      }, 1000)
    })
  },
})

const scrollContainer = ref<HTMLElement | null>(null)

function fixScroll() {
  if (scrollContainer.value)
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

const text = ref()

const { mutate: sendMessage } = useMutation({
  mutationFn: (data: { type: "text", value: string }) => $fetch(`/api/message/${params.username}`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["chats"],
    })

    text.value = ""
  },
})

function handleSend() {
  sendMessage({ type: "text", value: text.value })
}
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

        <main ref="scrollContainer" class="py-4 px-12 flex-1 overflow-y-auto relative">
          <Resource
            :loading="chatQuery.isPending.value"
            :error="chatQuery.isError.value"
            @execute="chatQuery.refetch"
          >
            <ChatConversation
              :chats="chatQuery.data.value!"
              @fix-scroll="fixScroll"
            />
          </Resource>
        </main>

        <ChatFooter
          v-model="text"
          @send="handleSend"
        />
      </Resource>
    </template>
  </AppLayout>
</template>
