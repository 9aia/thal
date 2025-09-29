import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { inReplyTos } from '~/store'
import type { History } from '#shared/types'
import type { MessageStatus } from '~~/server/db/schema'

function useChatQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  return useQuery({
    queryKey: queryKeys.chat(username),
    queryFn: () => $fetch(`/api/chat/${toValue(username)}` as `/api/chat/:username`, {
      headers,
    }),
  })
}

export interface UpdateInReplyToBeingLastMessage {
  content: string
  status: MessageStatus
  success?: boolean
}

export function useChatQueryUtils(username: MaybeRef<string>) {
  function updateInReplyToBeingLastMessage(newInReplyTo: UpdateInReplyToBeingLastMessage, newHistory: History = []) {
    const inReplyTo = inReplyTos[toValue(username)]
    const lastMessage = newInReplyTo.success
      ? newHistory[newHistory.length - 2]
      : newHistory[newHistory.length - 1]

    if (inReplyTo && inReplyTo.id === lastMessage?.id) {
      inReplyTo.content = newInReplyTo.content
      inReplyTo.status = newInReplyTo.status
    }
  }

  return {
    updateInReplyToBeingLastMessage,
  }
}

export default useChatQuery
