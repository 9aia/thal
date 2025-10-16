import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { chatListSearch } from '~/store'
import type { Chats } from '#shared/types'
import type { MessageStatus } from '~~/server/db/schema'

function useChatClient(username: MaybeRef<string>) {
  const queryClient = useQueryClient()
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()
  const characterQuery = useCharacterQuery(username)
  const contactQuery = useContactQuery(username)

  function createIfNotExists(data: { messageContent: string, messageDatetime: number, messageStatus: MessageStatus }) {
    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value), (oldChats: Chats) => {
      if (!oldChats) {
        return []
      }

      const _username = toValue(username)
      const newChats = [...oldChats]
      const chatIndex = newChats.findIndex(chat => chat.username === _username)

      if (chatIndex === -1) {
        const characterData = characterQuery.data.value
        if (!characterData?.name) {
          throw new Error('Character data is required to create a chat')
        }
        // You can't create a chat without a character

        newChats.unshift({
          chatId: newChats.length + 1,
          username: _username,
          characterName: characterData.name,
          contactName: contactQuery.data.value?.name || undefined,
          lastMessageContent: data.messageContent,
          lastMessageDatetime: data.messageDatetime,
          lastMessageStatus: data.messageStatus,
        })
      }

      return newChats
    })
  }

  function setLastMessage(lastMessage: { content: string, time: number, status: MessageStatus }) {
    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value), (oldChats: Chats) => {
      if (!oldChats) {
        return []
      }

      const _username = toValue(username)
      const newChats = [...oldChats]
      const chatIndex = newChats.findIndex(chat => chat.username === _username)

      if (chatIndex !== -1) {
        const existingChat = newChats[chatIndex]
        if (existingChat) {
          newChats[chatIndex] = {
            ...existingChat,
            lastMessageContent: lastMessage.content,
            lastMessageDatetime: lastMessage.time,
            lastMessageStatus: lastMessage.status,
          }
        }
      }

      return newChats
    })
  }

  function deleteLastMessage() {
    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value), (oldChats: Chats) => {
      if (!oldChats) {
        return []
      }

      const _username = toValue(username)
      const newChats = [...oldChats]
      const chatIndex = newChats.findIndex(chat => chat.username === _username)

      if (chatIndex !== -1) {
        const existingChat = newChats[chatIndex]
        if (existingChat) {
          newChats[chatIndex] = {
            ...existingChat,
            lastMessageContent: '',
            lastMessageDatetime: undefined,
            lastMessageStatus: undefined,
          }
        }
      }

      return newChats
    })
  }

  return {
    createIfNotExists,
    setLastMessage,
    deleteLastMessage,
  }
}

export default useChatClient
