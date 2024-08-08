import { z } from "zod"
import { and, eq } from "drizzle-orm"
import { getValidated } from "~/utils/h3"
import { notFound, unauthorized } from "~/utils/nuxt"
import { chats, messageSendSchema, messages, usernameSchema } from "~~/db/schema"
import { getPersonaByUsername } from "~/server/services/persona"
import { now } from "~/utils/date"
import { getHistory } from "~/server/services/messages"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  console.log("getting persona")

  const persona = await getPersonaByUsername(orm, username)

  if (!persona)
    throw notFound("Persona not found")

  console.log("querying")

  const [chat] = await orm
    .select()
    .from(chats)
    .where(
      and(
        eq(chats.userId, user.id),
        eq(chats.personaId, persona.id),
      ),
    )

  if (!chat)
    throw notFound("Chat not found")

  console.log("getting history")

  const history = await getHistory(orm, chat)

  console.log(history)

  return history
})
