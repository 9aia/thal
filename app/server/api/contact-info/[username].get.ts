import { z } from 'zod'
import { and, eq } from 'drizzle-orm'
import { getValidated } from '~/utils/h3'
import { badRequest, unauthorized } from '~/utils/nuxt'
import { characterLocalizations, characterUsernames, contacts, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const { locale } = await getValidated(event, 'query', z.object({
    locale: z.enum(['pt-BR', 'en-US']),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const contactGetDto = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    columns: {
      username: true,
    },
    with: {
      character: {
        columns: {
          categoryId: true,
          createdAt: true,
        },
        with: {
          characterLocalizations: {
            where: eq(characterLocalizations.locale, locale),
            columns: {
              name: true,
              description: true,
            },
          },
        },
      },
      contacts: {
        where: eq(contacts.userId, user.id!),
        columns: {
          name: true,
        },
      },
    },
  })

  if (!contactGetDto)
    throw badRequest('Character not found')

  const contact = contactGetDto?.contacts[0]
  delete (contactGetDto as any).contacts

  return {
    ...contactGetDto as Omit<typeof contactGetDto, 'contacts'>,
    contact,
  }
})
