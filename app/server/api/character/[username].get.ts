import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { notFound, unauthorized } from '~/utils/nuxt'
import { characterUsernames, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: true,
    },
  })

  if (!result?.character)
    throw notFound()

  return {
    ...result.character,
    username,
  }
})
