import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { chats } from "~~/db/schema"
import { badRequest, unauthorized } from "~/utils/nuxt"
import { getValidated } from "~/utils/h3"
import { numericString } from "~/utils/zod"

export default defineEventHandler(async (event) => {
  const { id } = await getValidated(event, "params", z.object({
    id: numericString(z.number()),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const [deletedChat] = await orm
    .delete(chats)
    .where(
      and(
        eq(chats.id, id),
        eq(chats.userId, user.id!),
      ),
    ).returning()

  if (!deletedChat)
    throw badRequest("Chat not found")

  return deletedChat
})
