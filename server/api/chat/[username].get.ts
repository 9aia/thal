import { z } from 'zod'
import { getValidated } from '~~/server/utils/h3'
import { unauthorized } from '~~/server/utils/nuxt'
import { usernameSchema } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({
    username: usernameSchema,
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.usernames.findFirst({
    with: {
      chats: {
        where: (chats, { eq }) => eq(chats.userId, user.id!),
      },
    },
    where: (usernames, { eq }) => eq(usernames.text, username),
  })

  const chat = result?.chats[0]

  if (!chat) {
    return {
      id: null,
      createdAt: null,
      updatedAt: null,
      usernameId: null,
      userId: null,
      contactId: null,
    }
  }

  return chat
})
