<script setup lang="ts">
import { t } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useOnline } from '@vueuse/core'
import AppLayout from '~/layouts/app.vue'
import queryKeys from '~/queryKeys'
import { chatItemSearch, replies, sendingChatIds, sentErrorChatIds } from '~/store'
import type { ChatItem } from '~/types'

const route = useRoute()

definePageMeta({
  layout: false,
  middleware: 'premium',
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

const text = ref('')

interface SendMessageData {
  type: 'text'
  value: string
  refresh: boolean
  replyingId?: number
  replyMessage?: string
  replyFrom?: 'user' | 'bot'
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
    from: 'user',
    status: isOnline.value ? 'seen' : 'sending',
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

function updateLastMessage(newMessage: SendMessageData, isError = false) {
  const newChat: ChatItem = {
    chatId: Number(data.value.chatId),
    contactName: data.value.contact?.name,
    personaUsername: data.value.username,
    lastMessageContent: newMessage.value,
    lastMessageStatus: isError ? 'error' : (isOnline.value ? 'seen' : 'sending'),
    lastMessageDatetime: new Date().getTime(),
    personaName: data.value.name,
  }

  queryClient.setQueryData(queryKeys.chatsSearch(chatItemSearch.value), (oldData: ChatItem[]) => {
    let newChats = [...oldData]

    const chatIndex = newChats.findIndex((lastMessage: ChatItem) => lastMessage.chatId === data.value.chatId)

    if (chatIndex !== -1) {
      newChats[chatIndex] = newChat

      newChats = swapToFirst(newChats, chatIndex)
    }
    else {
      newChats.unshift(newChat)
    }

    return newChats
  })
}

function emptyInput() {
  const username = route.params.username as string
  delete replies[username]

  text.value = ''
}

const newMessageTmp = ref()

const { mutate: sendMessage, isError: mutationError, isPending: isMessagePending } = useMutation({
  mutationFn: (data: SendMessageData) => $fetch(`/api/message/${route.params.username}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  async onMutate(newMessage) {
    sendingChatIds.value.add(data.value!.chatId!)
    if (newMessage.refresh)
      return

    newMessageTmp.value = newMessage

    updateHistory(newMessage)
    updateLastMessage(newMessage)
    emptyInput()
    fixScroll()
  },
  onError: async (e) => {
    console.log(e)

    const newHistory = [...data.value.history || []]

    const lastMessage = newHistory[newHistory.length - 1]

    newHistory[newHistory.length - 1] = {
      ...lastMessage,
      status: 'error',
    }

    updateLastMessage(newMessageTmp.value, true)

    queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
      ...data.value,
      history: newHistory,
    })

    sentErrorChatIds.value.add(data.value!.chatId!)
    sendingChatIds.value.delete(data.value!.chatId!)

    fixScroll()
  },
  onSuccess: async (newHistory) => {
    if (data.value.history.length === 1) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats,
      })
    }

    queryClient.invalidateQueries({
      queryKey: queryKeys.chats,
    })

    queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
      ...data.value,
      history: newHistory,
    })

    sentErrorChatIds.value.delete(data.value!.chatId!)
    sendingChatIds.value.delete(data.value!.chatId!)

    fixScroll()
  },
})

function handleSend() {
  sendMessage({
    type: 'text',
    value: text.value,
    refresh: false,
    replyingId: replying.value?.id,
    replyMessage: replying.value?.message,
    replyFrom: replying.value?.from,
  })
}

function handleResend() {
  const lastMessage = data.value.history[data.value.history.length - 1]

  if (lastMessage.status === 'error') {
    sendMessage({
      type: 'text',
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

        <ChatFooter
          v-model="text"
          :username="route.params.username"
          :chat-id="data!.chatId!"
          @send="handleSend()"
        />
      </GenericResource>
    </template>
  </AppLayout>
</template>
