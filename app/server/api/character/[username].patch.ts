import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { categorizeCharacter } from '~/server/services/character'
import { getValidated } from '~/utils/h3'
import { forbidden, notFound, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import { characterUpdateSchema, characterUsernames, characters, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user)) {
    throw paymentRequired()
  }

  const data = await getValidated(event, 'body', characterUpdateSchema)

  const result = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: true,
    },
  })

  const character = result?.character

  if (!character)
    throw notFound()

  if (character.creatorId !== user.id)
    throw forbidden()

  const {
    username: characterUsername,
    ...characterData
  } = data

  const categoryId = await categorizeCharacter(event, data)

  const updatedCharacter = await orm
    .update(characters)
    .set({
      ...characterData,
      categoryId,
      conversationStarters: JSON.stringify(data.conversationStarters),
    })
    .where(eq(characters.id, character.id))
    .returning()

  if (characterUsername !== result.username) {
    await orm.update(characterUsernames)
      .set({ username: characterUsername })
      .where(eq(characterUsernames.id, result.id))
  }

  return updatedCharacter
})
