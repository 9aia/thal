import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { characterUsernames, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))

  if (!usernameSchema.safeParse(username).success) {
    return {
      characterNotFound: true,
      alreadyAdded: false,
      discoverable: null,
      isUsernameValid: false,
    }
  }

  const [existingCharacterUsername] = await orm
    .select()
    .from(characterUsernames)
    .where(eq(characterUsernames.username, username))

  if (!existingCharacterUsername || existingCharacterUsername.characterId == null) {
    return {
      characterNotFound: true,
      alreadyAdded: false,
      discoverable: null,
      isUsernameValid: true,
    }
  }

  const character = await orm.query.characters.findFirst({
    where: (characters, { eq }) => eq(characters.id, Number(existingCharacterUsername.characterId)),
    columns: {
      discoverable: true,
      creatorId: true,
    },
    with: {
      characterUsernames: {
        columns: {
          id: true,
        },
        with: {
          contacts: {
            where: (contacts, { eq }) => and(eq(contacts.userId, user.id), eq(contacts.characterUsernameId, existingCharacterUsername.id)),
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
    alreadyAdded: !!character?.characterUsernames?.contacts?.length,
    discoverable: character?.discoverable || character?.creatorId === user.id,
    isUsernameValid: true,
  }
})
