<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { useEventListener, useOnline, useScroll } from '@vueuse/core'
import AppLayout from '~/layouts/app.vue'
import queryKeys from '~/queryKeys'
import { chatItemSearch, edition, replies } from '~/store'
import { OPTIMISTIC_CHAT_ID } from '~/constants/chat'
import type { ChatItem, Message } from '~/types'

definePageMeta({
  layout: false,
  middleware: 'premium',
})

useAutoRedirect()

const route = useRoute()
const { t } = useI18nExperimental()
const queryClient = useQueryClient()
const localeWithDefaultRegion = useLocaleDefaultRegion()
const isOnline = useOnline()

// const {
//   data,
//   isPending,
//   isError,
//   refetch,
// } = await useQuery(() `/api/chat/item/${route.params.username}`, {
//   queryKey: queryKeys.chat(computed(() => route.params.username as string)),
//   params: () => ({
//     locale: localeWithDefaultRegion.value,
//   }),
// })

// const chatId = computed(() => {
//   return data.value?.chatId || OPTIMISTIC_CHAT_ID
// })

// const scrollContainer = ref<HTMLDivElement>()

// const mainScroll = useScroll(scrollContainer, {
//   behavior: 'smooth',
// })

// async function goToBottom() {
//   await nextTick()

//   if (!scrollContainer.value)
//     return

//   mainScroll.y.value = scrollContainer.value.scrollHeight
// }

// const isScrollable = ref(false)

// useEventListener(scrollContainer, 'scroll', () => {
//   const element = scrollContainer.value

//   if (!element) {
//     return
//   }

//   isScrollable.value = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
// })

// const isScrollDownButtonVisible = computed(() => {
//   return !mainScroll.arrivedState.bottom && isScrollable.value
// })

// const text = ref('')

// const replying = computed(() => {
//   const username = route.params.username as string
//   return replies[username]
// })

// function editHistory(editedMessage: SendMessageData) {
//   // update the message in the history based on the editedMessage.editingId
//   const newHistory = [...data.value.history || []]

//   const messageIndex = newHistory.findIndex(message => message.id === editedMessage.editingId)

//   if (messageIndex !== -1) {
//     newHistory[messageIndex] = {
//       ...newHistory[messageIndex],
//       message: editedMessage.value,
//     }
//   }

//   queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
//     ...data.value,
//     history: newHistory,
//   })
// }

// function updateLastMessage(newMessage: SendMessageData, isError = false) {
//   const newChat: ChatItem = {
//     chatId: chatId.value,
//     contactName: data.value.contact?.name,
//     username: data.value.username,
//     lastMessageContent: newMessage.value,
//     lastMessageStatus: isError ? 'error' : (isOnline.value ? 'seen' : 'sending'),
//     lastMessageDatetime: new Date().getTime(),
//     characterName: data.value.name!,
//   }

//   queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatItemSearch.value), (oldData: ChatItem[]) => {
//     let newChats = [...oldData]

//     const chatIndex = newChats.findIndex((lastMessage: ChatItem) => lastMessage.username === data.value.username)

//     if (chatIndex !== -1) {
//       newChats[chatIndex] = newChat

//       newChats = swapToFirst(newChats, chatIndex)
//     }
//     else {
//       newChats.unshift(newChat)
//     }

//     return newChats
//   })
// }

// const newMessageTmp = ref()

// const messageError = computed(() => {
//   if (mutationError.value) {
//     return true
//   }

//   if (!data.value) {
//     return false
//   }

//   if (data.value.history.length === 0) {
//     return false
//   }

//   if (data.value.history[data.value.history.length - 1].status === 'error') {
//     return true
//   }

//   return false
// })

// function handleResend() {
//   const lastMessage = data.value.history[data.value.history.length - 1]

//   if (lastMessage.status === 'error') {
//     sendMessage({
//       value: lastMessage.message,
//       refresh: true,
//       replyingId: replying.value?.id,
//       replyMessage: replying.value?.message,
//       replyFrom: replying.value?.from,
//     })
//   }
// }

// function handleEdit() {
//   const messageIndex = data.value.history.findIndex(message => message.id === edition.editingMessageId)
//   const editingMessage = data.value.history[messageIndex]

//   handleDelete(edition.editingMessageId!, false)

//   sendMessage({
//     value: edition.message!,
//     editingId: edition.editingMessageId!,
//     replyingId: editingMessage?.replyingMessage?.id,
//     replyMessage: editingMessage?.replyingMessage?.message,
//     replyFrom: editingMessage?.replyingMessage?.from,
//   })

//   edition.message = ''
//   edition.editing = false
// }

// const { hasContact, displayName, avatarName, addContact } = useContactInfo(data)
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <ChatList />
    </template>

    <template #content>
      <div class="flex flex-col h-dvh justify-center items-center bg-gray-50">
        <ChatHeader />
        <!-- <ChatHeader
          :character-id="data!.id!"
          :display-name="displayName"
          :avatar-name="avatarName"
          :username="data!.username"
          :has-contact="hasContact"
          :add-contact="addContact"
          :has-messages="data?.history.length > 0"
        /> -->

        <!-- <ChatBody />

        <ChatFooter
          v-model="text"
          @fix-scroll="goToBottom"
          :username="route.params.username"
          :chat-id="chatId"
          :is-character-deleted="data.isCharacterDeleted"
        /> -->
      </div>
    </template>
  </AppLayout>
</template>
