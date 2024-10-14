import { eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "lucia"
import type { Message } from "~/types"
import { addReplyToMessage } from "~/utils/chat"
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
    return []

  // TODO perf: don't iterate again
  const messages: Message[] = chat?.messages.map((message) => {
    const replyMessage = chat?.messages.find(m => m.id === message.replyingId)?.data?.value
    const fullMessage = addReplyToMessage(message.data.value, replyMessage)

    return {
      id: message.id,
      status: "sent",
      from: message.isBot === 0 ? "user" : "bot",
      message: fullMessage,
      time: message.createdAt,
      replyingId: message.replyingId,
    }
  })

  return messages
}
