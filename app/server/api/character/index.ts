import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { characterLocalizations, characters, localeSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { locale } = await getValidated(event, 'query', z.object({
    locale: localeSchema,
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.characters.findMany({
    where: and(
      eq(characters.creatorId, user.id),
      isNull(characters.deletedAt),
    ),
    columns: {
      id: true,
      creatorId: true,
      categoryId: true,
      discoverable: true,
    },
    with: {
      usernames: {
        columns: {
          text: true,
        },
      },
      characterLocalizations: {
        where: and(
          eq(characterLocalizations.locale, locale!),
          isNull(characterLocalizations.deletedAt),
        ),
      },
    },
  })

  return result
})
