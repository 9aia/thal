import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { chats, usernameSchema, usernames } from '~~/db/schema'
import { badRequest, notFound, unauthorized } from '~/utils/nuxt'
import { getValidated } from '~/utils/h3'

export default defineEventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({
    username: usernameSchema,
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const usernameResult = await orm.query.usernames.findFirst({
    where: usernames => eq(usernames.username, username),
  })

  if (!usernameResult)
    throw notFound()

  const [deletedChat] = await orm
    .delete(chats)
    .where(
      and(
        eq(chats.usernameId, usernameResult.id),
        eq(chats.userId, user.id),
      ),
    ).returning()

  if (!deletedChat)
    throw badRequest(`Chat not found for username: ${username}`)

  return deletedChat
})
