import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { characterLocalizations, characters } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { locale } = await getValidated(event, 'query', z.object({ locale: z.string() }))

  if (!user)
    throw unauthorized()

  const result = await orm.query.characters.findMany({
    where: eq(characters.creatorId, user.id),
    columns: {
      id: true,
      creatorId: true,
      categoryId: true,
      discoverable: true,
    },
    with: {
      characterUsernames: {
        columns: {
          username: true,
        },
      },
      characterLocalizations: {
        where: eq(characterLocalizations.locale, locale),
      },
    },
  })

  return result
})
