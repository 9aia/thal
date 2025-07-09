import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { now } from '~/utils/date'
import { getValidated } from '~/utils/h3'
import { forbidden, notFound, unauthorized } from '~/utils/nuxt'
import { characters, usernameSchema, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.text, username),
    with: {
      character: true,
    },
  })

  if (!result?.character)
    throw notFound()

  if (result.character.creatorId !== user.id)
    throw forbidden()

  const deletedCharacter = await orm
    .update(characters)
    .set({
      deletedAt: now(),
    })
    .where(eq(characters.id, result?.character.id))
    .returning()

  return deletedCharacter
})
