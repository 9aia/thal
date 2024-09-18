import { eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "lucia"
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
    return []

  // TODO perf: don't iterate again
  const messages: Message[] = chat?.messages.map(message => ({
    id: message.id.toString(),
    status: "sent",
    from: message.isBot === 0 ? "user" : "bot",
    message: message.data.value,
    time: message.createdAt,
  }))

  return messages
}
