import { eq } from "drizzle-orm"
import { chats } from "~~/db/schema"
import { unauthorized } from "~/utils/nuxt"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const values = await orm
    .select()
    .from(chats)
    .where(eq(chats.userId, user.id))

  return values
})
