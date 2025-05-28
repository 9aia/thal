import { and, eq, isNull } from 'drizzle-orm'
import { getValidated } from '~/utils/h3'
import { badRequest, conflict, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import type { CharacterGet } from '~~/db/schema'
import { characterDraftInsertSchema, characterDrafts, characterLocalizations, characters, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const data = await getValidated(event, 'body', characterDraftInsertSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired()

  const isEdition = !!data.characterId

  const existingDraft = await orm.query.characterDrafts.findFirst({
    where: and(
      eq(characterDrafts.creatorId, user.id),
      isEdition ? eq(characterDrafts.characterId, data.characterId!) : isNull(characterDrafts.characterId),
    ),
    with: {
      characterDraftLocalizations: {
        columns: {
          name: true,
          description: true,
          instructions: true,
          locale: true,
          id: true,
        },
      },
    },
  })

  if (!existingDraft) {
    throw badRequest(isEdition ? `No editing draft found for characterId ${data.characterId}` : 'No creating character draft found')
  }

  const draftData = existingDraft.data

  // Check if username is already taken
  const [existingUsername] = await orm
    .select()
    .from(usernames)
    .where(eq(usernames.username, draftData.username))

  if (existingUsername && existingUsername.characterId !== null && existingUsername.characterId !== data.characterId)
    throw conflict('Username already taken')

  let character: CharacterGet

  if (isEdition) {
    // Update character from draft
    const [updatedCharacter] = await orm.update(characters).set({
      discoverable: data.discoverable,
      prompt: existingDraft.prompt,
      categoryId: draftData.categoryId,
    }).where(eq(characters.id, data.characterId!)).returning()

    await orm.update(usernames)
      .set({ username: draftData.username })
      .where(eq(usernames.characterId, updatedCharacter.id))

    for (const localization of existingDraft.characterDraftLocalizations) {
      await orm.update(characterLocalizations).set({
        characterId: updatedCharacter.id,
        description: localization.description,
        instructions: localization.instructions,
        name: localization.name,
        locale: localization.locale,
      }).where(and(eq(characterLocalizations.locale, localization.locale), eq(characterLocalizations.characterId, updatedCharacter.id)))
    }

    character = updatedCharacter
  }
  else {
    // Create character from draft
    const [newCharacter] = await orm.insert(characters).values({
      discoverable: data.discoverable,
      creatorId: user.id,
      prompt: existingDraft.prompt,
      categoryId: draftData.categoryId,
    }).returning()

    character = newCharacter

    // Update character username for keeping messages
    const isNewUsername = existingUsername === undefined

    if (isNewUsername) {
      await orm.insert(usernames).values({
        username: draftData.username,
        characterId: character.id,
      })
    }
    else {
      await orm
        .update(usernames)
        .set({
          characterId: character.id,
        })
        .where(eq(usernames.username, draftData.username))
    }

    for (const localization of existingDraft.characterDraftLocalizations) {
      await orm.insert(characterLocalizations).values({
        characterId: character.id,
        description: localization.description,
        instructions: localization.instructions,
        name: localization.name,
        locale: localization.locale,
      })
    }
  }

  // Update draft with characterId for future edits
  await orm.update(characterDrafts).set({
    characterId: character.id,
  }).where(eq(characterDrafts.id, existingDraft.id))

  return {
    ...character,
    characterLocalizations: existingDraft.characterDraftLocalizations,
    username: draftData.username,
    characterId: character.id,
    creatorId: user.id,
  }
})
