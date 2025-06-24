import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import type { History, Message } from '~/types'

function useHistoryClient(username: MaybeRef<string>) {
  const queryClient = useQueryClient()

  function pushMessage(message: Message) {
    queryClient.setQueryData(queryKeys.history(username), (oldHistory: History) => {
      return [
        ...(oldHistory as History),
        message,
      ]
    })
  }

  function updateLastMessage(newMessage: Partial<Message>) {
    queryClient.setQueryData(queryKeys.history(username), (oldHistory: History) => {
      const oldLastMessage = oldHistory[oldHistory.length - 1]
      const historyWithoutLastMessage = oldHistory.slice(0, -1)
      const updatedLastMessage = {
        ...oldLastMessage,
        ...newMessage,
      }

      return [
        ...historyWithoutLastMessage,
        updatedLastMessage,
      ]
    })
  }

  function deleteMessage(messageId: number) {
    queryClient.setQueryData(queryKeys.history(username), (oldData: History) => {
      return oldData.filter(message => message.id !== messageId)
    })
  }

  function set(newHistory: History) {
    queryClient.setQueryData(queryKeys.history(username), newHistory)
  }

  return {
    set,
    pushMessage,
    updateLastMessage,
    deleteMessage,
  }
}

export default useHistoryClient
