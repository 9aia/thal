import { eq } from 'drizzle-orm'
import { unauthorized } from '~/utils/nuxt'
import { characterUsernames, characters } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.select({
    id: characters.id,
    name: characters.name,
    description: characters.description,
    instructions: characters.instructions,
    username: characterUsernames.username,
    categoryId: characters.categoryId,
    discoverable: characters.discoverable,
  })
    .from(characters)
    .where(eq(characters.creatorId, user.id!))
    .leftJoin(characterUsernames, eq(characterUsernames.characterId, characters.id))

  return result
})
