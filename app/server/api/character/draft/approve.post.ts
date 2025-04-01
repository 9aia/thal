import { and, eq, isNull } from 'drizzle-orm'
import { now } from '~/utils/date'
import { getValidated } from '~/utils/h3'
import { badRequest, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import type { CharacterGet } from '~~/db/schema'
import { characterDraftInsertSchema, characterDrafts, characterUsernames, characters } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const data = await getValidated(event, 'body', characterDraftInsertSchema)

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired()

  const isEdition = !!data.characterId

  const [existingDraft] = await orm.select().from(characterDrafts).where(
    and(
      eq(characterDrafts.creatorId, user.id),
      isEdition ? eq(characterDrafts.characterId, data.characterId!) : isNull(characterDrafts.characterId),
    ),
  )

  if (!existingDraft) {
    throw badRequest(isEdition ? `No editing draft found for characterId ${data.characterId}` : 'No creating character draft found')
  }

  const draftData = existingDraft.data

  // Check if username is already taken
  const [existingCharacterUsername] = await orm
    .select()
    .from(characterUsernames)
    .where(eq(characterUsernames.username, draftData.username))

  if (existingCharacterUsername && existingCharacterUsername.characterId !== null && existingCharacterUsername.characterId !== data.characterId)
    throw badRequest('Username already taken')

  let character: CharacterGet

  if (isEdition) {
    // Update character from draft
    const [updatedCharacter] = await orm.update(characters).set({
      name: draftData.name,
      description: draftData.description,
      instructions: draftData.instructions,
      discoverable: data.discoverable,
      categoryId: draftData.categoryId,
    }).where(eq(characters.id, data.characterId!)).returning()

    await orm.update(characterUsernames)
      .set({ username: draftData.username })
      .where(eq(characterUsernames.characterId, updatedCharacter.id))

    character = updatedCharacter
  }
  else {
    // Create character from draft
    const [newCharacter] = await orm.insert(characters).values({
      name: draftData.name,
      description: draftData.description,
      instructions: draftData.instructions,
      discoverable: data.discoverable,
      creatorId: user.id,
      createdAt: now().toString(),
      categoryId: draftData.categoryId,
    }).returning()

    character = newCharacter

    // Update character username for keeping messages
    const isNewCharacterUsername = existingCharacterUsername === undefined

    if (isNewCharacterUsername) {
      await orm.insert(characterUsernames).values({
        username: draftData.username,
        characterId: character.id,
      })
    }
    else {
      await orm
        .update(characterUsernames)
        .set({
          characterId: character.id,
        })
        .where(eq(characterUsernames.username, draftData.username))
    }
  }

  // Update draft with characterId for future edits
  await orm.update(characterDrafts).set({
    characterId: character.id,
  }).where(eq(characterDrafts.id, existingDraft.id))

  return {
    ...character,
    username: draftData.username,
  }
})
