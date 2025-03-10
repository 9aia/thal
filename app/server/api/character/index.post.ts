import { eq } from 'drizzle-orm'
import { categorizeCharacter } from '~/server/services/character'
import { now } from '~/utils/date'
import { getValidated } from '~/utils/h3'
import { badRequest, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import { characterInsertSchema, characterUsernames, characters } from '~~/db/schema'

export default eventHandler(async (event) => {
  const data = await getValidated(event, 'body', characterInsertSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user)) {
    throw paymentRequired()
  }

  const {
    username,
    ...characterData
  } = data

  const [existingCharacterUsername] = await orm
    .select()
    .from(characterUsernames)
    .where(eq(characterUsernames.username, username))

  if (existingCharacterUsername && existingCharacterUsername.characterId !== null)
    throw badRequest('Username already taken')

  const categoryId = await categorizeCharacter(event, data)

  const [newCharacter] = await orm
    .insert(characters)
    .values({
      ...characterData,
      conversationStarters: JSON.stringify(characterData.conversationStarters),
      creatorId: user.id,
      createdAt: now().toString(),
      categoryId,
    })
    .returning()

  const isNewCharacterUsername = existingCharacterUsername === undefined

  if (isNewCharacterUsername) {
    await orm.insert(characterUsernames).values({
      username,
      characterId: newCharacter.id,
    })
  }
  else {
    await orm
      .update(characterUsernames)
      .set({
        characterId: newCharacter.id,
      })
      .where(eq(characterUsernames.username, username))
  }

  return {
    ...newCharacter,
    username,
  }
})
