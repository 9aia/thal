import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { notFound, unauthorized } from '~/utils/nuxt'
import { characterLocalizations, usernameSchema, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({
    username: usernameSchema,
  }))
  const { locale } = await getValidated(event, 'query', z.object({
    locale: z.enum(['pt-BR', 'en-US']),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.text, username),
    with: {
      character: {
        columns: {
          id: true,
          createdAt: true,
          categoryId: true,
          discoverable: true,
          creatorId: true,
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
    },
  })

  if (!result)
    throw notFound('Username not found')

  const character = result.character

  return {
    id: character?.id || null,
    username,
    creatorId: character?.creatorId || null,
    name: character?.characterLocalizations[0]?.name || null,
    description: character?.characterLocalizations[0]?.description || null,
    createdAt: character?.createdAt || null,
    categoryId: character?.categoryId || null,
  }
})
