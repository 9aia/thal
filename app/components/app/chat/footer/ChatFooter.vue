<script lang="ts" setup>
import { replies } from '~/store'

defineProps<{
  chatId: number
}>()

const text = defineModel<string>({
  required: true,
})

const route = useRoute()
const { goToBottom } = useChatHistoryScroll()

const username = computed(() => route.params.username as string)
// TODO: refactor replies
const isReplying = computed(() => !!replies[username.value])

// function emptyInput() {
//   delete replies[username.value]
//   text.value = ''
// }

// onMounted(() => {
//   const chatContainer = document.querySelector('#chat-container')

//   useEventListener(chatContainer, 'keydown', (event: KeyboardEvent) => {
//     if (edition.editing) {
//       return
//     }

//     // Ignore modifier keys
//     if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
//       return

//     // Explicitly check for 'Meta' key (some browsers may not set event.metaKey reliably)
//     if (event.key === 'Meta')
//       return

//     // Ignore function keys (F1-F12) and Escape
//     if (event.key.startsWith('F') || event.key === 'Escape')
//       return

//     contentEditableRef.value?.focus()
//   })

//   contentEditableRef.value?.focus()
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
</script>

<template>
  <footer class="bg-white flex items-end justify-center gap-2 w-full">
    <div class="flex flex-col w-full gap-1">
      <!-- <ChatFooterInputReply v-if="isReplying" /> -->

      <SendFieldset
        v-model="text"
        :chat-id="chatId"
      />
    </div>
  </footer>
</template>
