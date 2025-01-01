import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { personaUsernames, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))

  if (!usernameSchema.safeParse(username).success) {
    return {
      personaNotFound: true,
      alreadyAdded: false,
      discoverable: null,
      isUsernameValid: false,
    }
  }

  const [existingPersonaUsername] = await orm
    .select()
    .from(personaUsernames)
    .where(eq(personaUsernames.username, username))

  if (!existingPersonaUsername || existingPersonaUsername.personaId == null) {
    return {
      personaNotFound: true,
      alreadyAdded: false,
      discoverable: null,
      isUsernameValid: true,
    }
  }

  const persona = await orm.query.personas.findFirst({
    where: (personas, { eq }) => eq(personas.id, Number(existingPersonaUsername.personaId)),
    columns: {
      discoverable: true,
      creatorId: true,
    },
    with: {
      personaUsernames: {
        columns: {
          id: true,
        },
        with: {
          contacts: {
            where: (contacts, { eq }) => and(eq(contacts.userId, user.id), eq(contacts.personaUsernameId, existingPersonaUsername.id)),
            columns: {
              id: true,
            },
          },
        },
      },
    },
  })

  return {
    personaNotFound: false,
    alreadyAdded: !!persona?.personaUsernames?.contacts?.length,
    discoverable: persona?.discoverable || persona?.creatorId === user.id,
    isUsernameValid: true,
  }
})
