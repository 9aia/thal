<script setup lang="ts">
import type { InternalApi } from "nitropack"
import { t } from "@psitta/vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { useOnline } from "@vueuse/core"
import AppLayout from "~/layouts/app.vue"
import queryKeys from "~/queryKeys"
import { replies } from "~/store"
import type { LastMessage } from "~/types"

const route = useRoute()

definePageMeta({
  layout: false,
  middleware: "premium",
})

const queryClient = useQueryClient()

const {
  data,
  isLoading,
  isError,
  refetch,
} = await useServerQuery(() => `/api/chat/item/${route.params.username}` as `/api/chat/item/:username`, {
  queryKey: queryKeys.chat(computed(() => route.params.username as string)),
})

const scrollContainer = ref<HTMLElement | null>(null)

async function fixScroll() {
  await nextTick()

  setTimeout(() => {
    if (scrollContainer.value)
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }, 0)
}

const text = ref("")

interface SendMessageData {
  type: "text"
  value: string
  refresh: boolean
  replyingId?: number
  replyMessage?: string
  replyFrom?: "user" | "bot"
}

const replying = computed(() => {
  const username = route.params.username as string
  return replies[username]
})

const isOnline = useOnline()

function updateHistory(newMessage: SendMessageData) {
  const newHistory = [...data.value.history || []]

  newHistory.push({
    id: newHistory.length + 1,
    from: "user",
    status: isOnline.value ? "seen" : "sending",
    message: newMessage.value,
    replyingId: newMessage.replyingId,
    replyMessage: newMessage.replyMessage,
    replyFrom: newMessage.replyFrom,
    time: new Date().getTime(),
  })

  queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
    ...data.value,
    history: newHistory,
  })
}

function updateLastMessage(newMessage: SendMessageData) {
  const newLastMessage: LastMessage = {
    chatId: Number(data.value.chatId),
    content: newMessage.value,
    status: isOnline.value ? "seen" : "sending",
    datetime: new Date().toISOString(),
  }

  queryClient.setQueryData(queryKeys.lastMessages, (oldData: LastMessage[]) => {
    const newLastMessages = [...oldData]

    const lastMessageIndex = newLastMessages.findIndex((lastMessage: any) => lastMessage.chatId === data.value.chatId)

    if (lastMessageIndex !== -1)
      newLastMessages[lastMessageIndex] = newLastMessage

    else
      newLastMessages.push(newLastMessage)

    return newLastMessages
  })
}

function emptyInput() {
  const username = route.params.username as string
  delete replies[username]

  text.value = ""
}

const { mutate: sendMessage, isError: mutationError, isPending: isMessagePending } = useMutation({
  mutationFn: (data: SendMessageData) => $fetch(`/api/message/${route.params.username}`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  async onMutate(newMessage) {
    if (newMessage.refresh)
      return

    updateHistory(newMessage)
    updateLastMessage(newMessage)
    emptyInput()
    fixScroll()
  },
  onError: async () => {
    const newHistory = [...data.value.history || []]

    const lastMessage = newHistory[newHistory.length - 1]

    newHistory[newHistory.length - 1] = {
      ...lastMessage,
      status: "error",
    }

    queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
      ...data.value,
      history: newHistory,
    })

    fixScroll()
  },
  onSuccess: async (newHistory) => {
    if (data.value.history.length === 1) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats,
      })
    }

    queryClient.invalidateQueries({
      queryKey: queryKeys.lastMessages,
    })

    queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
      ...data.value,
      history: newHistory,
    })

    fixScroll()
  },
})

function handleSend() {
  sendMessage({
    type: "text",
    value: text.value,
    refresh: false,
    replyingId: replying.value?.id,
    replyMessage: replying.value?.message,
    replyFrom: replying.value?.from,
  })
}

function handleResend() {
  const lastMessage = data.value.history[data.value.history.length - 1]

  if (lastMessage.status === "error") {
    sendMessage({
      type: "text",
      value: lastMessage.message,
      refresh: true,
      replyingId: replying.value?.id,
      replyMessage: replying.value?.message,
      replyFrom: replying.value?.from,
    })
  }
}

const { hasContact, displayName, avatarName, addContact } = useContactInfo(data)
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <Home />
    </template>

    <template #content>
      <GenericResource :loading="isLoading" :error="isError" @execute="refetch">
        <ChatHeader
          :name="displayName"
          :avatar-name="avatarName"
          :username="data!.username"
          :has-contact="hasContact"
          :add-contact="addContact"
          :has-messages="data?.history.length > 0"
        />

        <main
          id="chat-container"
          ref="scrollContainer"
          :tabindex="0"
          class="bg-slate-200 py-4 px-2 sm:px-12 flex-1 overflow-y-auto relative focus:outline-none"
        >
          <div class="mb-4 text-slate-800 text-xs bg-orange-100 px-4 py-2 rounded-lg flex gap-1">
            <Icon name="science" style="font-size: 1.15rem" />
            <p>
              {{ t('This app is for educational and entertainment purposes only. Content and interactions do not represent professional instruction. Verify information independently and use responsibly.') }}
            </p>
          </div>

          <div
            v-if="!hasContact"
            class="card bg-neutral text-neutral-content text-center sm:max-w-lg mx-auto"
          >
            <div class="card-body">
              <Avatar :name="avatarName" class="mx-auto w-20 h-20 text-lg bg-slate-300 text-slate-800" />

              <h2 class="text-slate-900 text-center mb-1">
                {{ displayName }}
              </h2>
              <small class="text-slate-600 text-xs">~ {{ data?.description }}</small>

              <p class="mb-2 text-slate-600 text-sm">
                {{ t('Not a contact') }}
              </p>

              <div class="card-actions justify-center">
                <Btn class="btn-outline btn-primary" @click="addContact()">
                  <Icon name="person_add" />
                  Add
                </Btn>
              </div>
            </div>
          </div>

          <ChatConversation
            :history="data.history"
            :is-error="mutationError"
            @fix-scroll="fixScroll"
            @resend="handleResend()"
          />

          <ChatBubbleLoading v-if="isMessagePending && isOnline" />
        </main>

        <ChatFooter v-model="text" :username="route.params.username" @send="handleSend()" />
      </GenericResource>
    </template>
  </AppLayout>
</template>
