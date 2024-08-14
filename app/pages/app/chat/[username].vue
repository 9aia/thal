<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import AppLayout from "~/layouts/app.vue"

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

const historyQuery = await useServerQuery(() => `/api/chat/history/${params.username}`, {
  queryKey: ["messages", computed(() => params.username)],
})

const scrollContainer = ref<HTMLElement | null>(null)

function fixScroll() {
  if (scrollContainer.value)
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

const text = ref("")

const { mutate: sendMessage } = useMutation({
  mutationFn: (data: { type: "text", value: string }) => $fetch(`/api/message/${params.username}`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  async onMutate(data) {
    const newHistory = [...historyQuery.data.value || []]

    newHistory.push({
      id: `${newHistory.length + 1}`,
      from: "user",
      status: "sending",
      message: data.value,
      text: "00:00",
    })

    queryClient.setQueryData(["messages", computed(() => params.username)], newHistory)
    await nextTick()
    fixScroll()
  },
  onSuccess: (newHistory) => {
    if (historyQuery.data.value?.length === 1) {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      })
    }

    queryClient.setQueryData(["messages", computed(() => params.username)], newHistory)
    fixScroll()

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
      <Resource :loading="isLoading" :error="isError" @execute="refetch">
        <ChatHeader :name="data?.name" />

        <main ref="scrollContainer" class="py-4 px-12 flex-1 overflow-y-auto relative">
          <Resource :loading="historyQuery.isPending.value" :error="historyQuery.isError.value" @execute="historyQuery.refetch">
            <ChatConversation :history="historyQuery.data.value!" @fix-scroll="fixScroll" />
          </Resource>
        </main>

        <ChatFooter v-model="text" @send="handleSend" />
      </Resource>
    </template>
  </AppLayout>
</template>
