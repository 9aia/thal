import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { usernameSchema, usernames } from '~~/db/schema'

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

  if (!existingUsername || existingUsername.characterId == null) {
    return {
      characterNotFound: true,
      alreadyAdded: false,
      discoverable: null,
      isUsernameValid: true,
    }
  }

  const character = await orm.query.characters.findFirst({
    where: (characters, { eq }) => eq(characters.id, Number(existingUsername.characterId)),
    columns: {
      discoverable: true,
      creatorId: true,
    },
    with: {
      usernames: {
        columns: {
          id: true,
        },
        with: {
          contacts: {
            where: (contacts, { eq }) => and(eq(contacts.userId, user.id), eq(contacts.usernameId, existingUsername.id)),
            columns: {
              id: true,
            },
          },
        },
      },
    },
  })

  return {
    characterNotFound: false,
    alreadyAdded: !!character?.usernames?.contacts?.length,
    discoverable: character?.discoverable || character?.creatorId === user.id,
    isUsernameValid: true,
  }
})
