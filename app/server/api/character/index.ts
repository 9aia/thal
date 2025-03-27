import { eq } from 'drizzle-orm'
import { unauthorized } from '~/utils/nuxt'
import { characters } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.characters.findMany({
    where: eq(characters.creatorId, user.id),
    columns: {
      id: true,
      name: true,
      description: true,
      instructions: true,
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
    },
  })

  return result
})
