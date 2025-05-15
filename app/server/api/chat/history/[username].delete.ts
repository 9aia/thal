import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { badRequest, unauthorized } from '~/utils/nuxt'
import { chats, lastMessages, messages, usernameSchema, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.username, username),
    with: {
      chats: {
        where: eq(chats.userId, user.id),
      },
    },
  })

  if (!result)
    throw badRequest('Character Username not found')

  const chatId = result?.chats?.[0]?.id

  if (!chatId)
    throw badRequest('Chat not found')

  const deletedMessages = await orm.delete(messages)
    .where(eq(messages.chatId, chatId))
    .returning()

  if (!deletedMessages.length)
    throw badRequest('Messages not found')

  await orm.delete(lastMessages)
    .where(eq(lastMessages.chatId, chatId))

  return deletedMessages
})
