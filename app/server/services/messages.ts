import { and, eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "lucia"
import type { PersonaGet } from "~~/db/schema"
import { chats, messages, personas, users } from "~~/db/schema"

export async function getHistory(
  orm: H3EventContext["orm"],
  chat: any,
) {
  console.log(chat)
  const history = await orm
    .select({
      id: messages.id,
      userName: users.name,
      personaName: personas.name,
      personaUsername: personas.username,
    })
    .from(messages)
    .leftJoin(chats, eq(messages.chatId, chats.id))
    .leftJoin(users, eq(chats.userId, users.id))
    .leftJoin(personas, eq(chats.personaId, personas.id))
    .where(eq(messages.chatId, chat.id))
    .all()

  /*   {
    id: string
    from: "user" | "bot"
    message: string
    text: string // horário
    status: string
  } */

  return history
}
