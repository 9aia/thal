import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~~/server/utils/h3'
import { unauthorized } from '~~/server/utils/nuxt'
import { usernameSchema, usernames } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (!usernameSchema.safeParse(username).success) {
    return {
      characterNotFound: true,
      alreadyAdded: false,
      discoverable: null,
      isUsernameValid: false,
    }
  }

  const [existingUsername] = await orm
    .select()
    .from(usernames)
    .where(eq(usernames.text, username))

  if (!existingUsername) {
    return {
      characterNotFound: true,
      alreadyAdded: false,
      discoverable: null,
      isUsernameValid: true,
    }
  }

  const result = await orm.query.usernames.findFirst({
    where: (usernames, { eq }) => eq(usernames.id, existingUsername.id),
    with: {
      contacts: {
        where: (contacts, { eq }) => and(
          eq(contacts.userId, user.id),
          eq(contacts.usernameId, existingUsername.id),
        ),
      },
      character: {
        columns: {
          discoverable: true,
          creatorId: true,
          deletedAt: true,
        },
      },
    },
  })

  const character = result?.character
  const contact = result?.contacts?.[0]

  return {
    characterNotFound: character == null || character?.deletedAt != null,
    alreadyAdded: !!contact,
    discoverable: (character?.discoverable || character?.creatorId === user.id) && character?.deletedAt == null,
    isUsernameValid: true,
  }
})
