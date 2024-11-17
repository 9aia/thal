import { eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "~~/db/schema"
import type { Message } from "~/types"
import { notFound } from "~/utils/nuxt"
import { chats, personaUsernames } from "~~/db/schema"

export async function getHistory(
  orm: H3EventContext["orm"],
  user: User,
  username: string,
) {
  const result = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    with: {
      chats: {
        where: eq(chats.userId, user.id),
        with: {
          messages: true,
        },
      },
    },
  })

  if (!result)
    throw notFound("Persona Username not found")

  const chat = result.chats[0]

  if (!chat?.id)
    return { chatId: null, history: [] } as { chatId: null, history: Message[] }

  const getReplyFrom = (replyingId: number) => {
    return chat?.messages.find(m => m.id === replyingId)?.isBot === 0 ? "user" : "bot"
  }

  // TODO perf: don't iterate again
  const messages: Message[] = chat?.messages.map((message) => {
    const replyMessage = chat?.messages.find(m => m.id === message.replyingId)?.data?.value

    return {
      id: message.id,
      status: "sent",
      from: message.isBot === 0 ? "user" : "bot",
      message: message.data.value,
      replyMessage,
      time: message.createdAt,
      replyingId: message.replyingId,
      replyFrom: message.replyingId
        ? getReplyFrom(message.replyingId)
        : undefined,
    }
  })

  return { history: messages, chatId: chat.id }
}
