import { eq } from "drizzle-orm"
import { unauthorized } from "~/utils/nuxt"
import { lastMessages } from "~~/db/schema"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const results = await orm.query.lastMessages.findMany({
    columns: {
      chatId: true,
      content: true,
      datetime: true,
    },
    where: eq(lastMessages.userId, user.id!),
  })

  return results
})
