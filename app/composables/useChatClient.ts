import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { chatListSearch } from '~/store'
import type { Chats } from '~/types'
import type { MessageStatus } from '~~/db/schema'

function useChatClient(username: MaybeRef<string>) {
  const queryClient = useQueryClient()
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()

  function setLastMessage(lastMessage: { content: string, time: number, status: MessageStatus }) {
    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value), (oldChats: Chats) => {
      const _username = toValue(username)
      const newChats = [...oldChats]
      const chatIndex = newChats.findIndex(chat => chat.username === _username)

      if (chatIndex !== -1) {
        newChats[chatIndex] = {
          ...newChats[chatIndex],
          lastMessageContent: lastMessage.content,
          lastMessageDatetime: lastMessage.time,
          lastMessageStatus: lastMessage.status,
        }
      }

      return newChats
    })
  }

  function deleteLastMessage() {
    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value), (oldChats: Chats) => {
      const _username = toValue(username)
      const newChats = [...oldChats]
      const chatIndex = newChats.findIndex(chat => chat.username === _username)

      if (chatIndex !== -1) {
        newChats[chatIndex] = {
          ...newChats[chatIndex],
          lastMessageContent: '',
          lastMessageDatetime: undefined,
          lastMessageStatus: undefined,
        }
      }

      return newChats
    })
  }

  return {
    setLastMessage,
    deleteLastMessage,
  }
}

export default useChatClient
