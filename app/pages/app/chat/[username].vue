<script setup lang="ts">
import type { FetchError } from 'ofetch'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useEventListener, useOnline, useScroll } from '@vueuse/core'
import { useI18n } from '@psitta/vue'
import AppLayout from '~/layouts/app.vue'
import queryKeys from '~/queryKeys'
import { chatItemSearch, isExpiredModalOpen, replies, sendingChatIds, sentErrorChatIds } from '~/store'
import type { ChatItem } from '~/types'

const route = useRoute()
const toast = useToast()

const { t } = useI18n()

definePageMeta({
  layout: false,
  middleware: 'premium',
})

useAutoRedirect()
const queryClient = useQueryClient()

const {
  data,
  isPending,
  isError,
  refetch,
} = await useServerQuery(() => `/api/chat/item/${route.params.username}` as `/api/chat/item/:username`, {
  queryKey: queryKeys.chat(computed(() => route.params.username as string)),
})

const scrollContainer = ref<HTMLDivElement>()

const mainScroll = useScroll(scrollContainer, {
  behavior: 'smooth',
})

async function goToBottom() {
  await nextTick()

  if (!scrollContainer.value)
    return

  mainScroll.y.value = scrollContainer.value.scrollHeight
}

const isScrollable = ref(false)

useEventListener(scrollContainer, 'scroll', () => {
  const element = scrollContainer.value

  if (!element) {
    return
  }

  isScrollable.value = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
})

const isScrollDownButtonVisible = computed(() => {
  return !mainScroll.arrivedState.bottom && isScrollable.value
})

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

    const chatIndex = newChats.findIndex((lastMessage: ChatItem) => lastMessage.personaUsername === data.value.username)

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

const RATE_LIMIT_STATUS_CODE = 429
const PAYMENT_REQUIRED_STATUS_CODE = 402

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
    goToBottom()
  },
  onError: async (e) => {
    const error = e as FetchError

    const errorStatus = error.response?.status

    if (errorStatus === RATE_LIMIT_STATUS_CODE) {
      toast.error(t('You are sending messages too fast. Please wait a moment.'))
    }

    if (errorStatus === PAYMENT_REQUIRED_STATUS_CODE) {
      isExpiredModalOpen.value = true
    }

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

    goToBottom()
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

    goToBottom()
  },
})

const messageError = computed(() => {
  if (mutationError.value) {
    return true
  }

  if (!data.value) {
    return false
  }

  if (data.value.history.length === 0) {
    return false
  }

  if (data.value.history[data.value.history.length - 1].status === 'error') {
    return true
  }

  return false
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
      <ChatList />
    </template>

    <template #content>
      <div class="flex flex-col h-dvh justify-center items-center bg-gray-50">
        <StyledResource
          :loading="isPending"
          :error="isError"
          @execute="refetch"
        >
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
            class="bg-white w-full py-4 px-4 flex-1 overflow-y-auto relative focus:outline-none"
          >
            <div class="sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto">
              <div class="max-w-xs sm:max-w-2xl md:max-w-3xl w-fit mx-auto flex items-center justify-center gap-1 mb-4 text-blue-500 text-xs bg-gradient-2 px-4 py-2 rounded-lg">
                <Icon name="science" class="text-blue-500" style="font-size: 1.15rem" />
                <p>
                  {{ t('This character uses AI to simulate interactions. Please use responsibly.') }}
                </p>
              </div>

              <div
                v-if="!hasContact"
                class="bg-gradient-1 mb-8 text-gray-800 text-center sm:max-w-lg mx-auto rounded-3xl"
              >
                <div class="py-8">
                  <Avatar :name="avatarName" class="mx-auto w-20 h-20 text-lg bg-gray-100 text-gray-800" />

                  <h2 class="text-gray-900 text-center mb-1">
                    {{ displayName }}
                  </h2>
                  <small class="text-gray-600 text-xs">~ {{ data?.description }}</small>

                  <p class="mb-2 text-gray-600 text-sm">
                    {{ t('Not a contact') }}
                  </p>

                  <div class="card-actions justify-center">
                    <Button class="bg-cyan-500 border-none rounded-full px-4 py-2 text-gray-800 hover:bg-cyan-400" @click="addContact()">
                      <Icon name="person_add" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <ChatConversation
                :history="data.history"
                :is-error="messageError"
                @fix-scroll="goToBottom"
                @resend="handleResend()"
              />

              <ChatBubbleLoading v-if="isMessagePending && isOnline" />

              <div class="sticky bottom-0 right-0 flex justify-end h-[32px]">
                <Button
                  shape="circle"
                  size="sm"
                  class="transition-opacity duration-500 opacity-0 ease-in-out text-blue-500"
                  :class="{ 'opacity-100': isScrollDownButtonVisible, 'pointer-events-none': !isScrollDownButtonVisible }"
                  @click="goToBottom"
                >
                  <Icon class="text-lg">
                    keyboard_arrow_down
                  </Icon>
                </Button>
              </div>
            </div>
          </main>

          <ChatFooter
            v-model="text"
            :username="route.params.username"
            :chat-id="data!.chatId!"
            @send="handleSend()"
          />
        </StyledResource>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.bg-gradient-1 {
  background: radial-gradient(at top, theme('colors.yellow.50'), theme('colors.gray.50'));
}

.bg-gradient-2 {
  background: radial-gradient(at bottom, theme('colors.blue.50'), theme('colors.gray.50'));
}
</style>
