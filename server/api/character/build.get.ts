import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getCharacterCategoryName } from '~~/server/services/character'
import { getValidated } from '~~/server/utils/h3'
import { noContent, unauthorized } from '~~/server/utils/nuxt'
import { numericString } from '#shared/utils/zod'
import { characterDraftLocalizations, characterDrafts, characterLocalizations, characters, localeSchema, usernames } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const { characterId: characterIdParam, characterUsername, locale } = await getValidated(event, 'query', z.object({
    characterId: numericString(z.number().optional()),
    characterUsername: z.string().optional(), // Fallback to username if characterId is not available
    locale: localeSchema,
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  let characterId: number | null = characterIdParam

  if (!characterId && characterUsername) {
    const [result] = await orm.select().from(characters)
      .leftJoin(usernames, eq(characters.id, usernames.characterId))
      .where(and(isNull(characters.deletedAt), eq(usernames.text, characterUsername)))

    if (!result?.Character?.id)
      throw noContent('There is no character with this username, so there is no draft to edit')

    characterId = result.Character.id
  }

  const draftCharacter = await orm.query.characterDrafts.findFirst({
    where: and(
      eq(characterDrafts.creatorId, user.id),
      characterId
        ? eq(characterDrafts.characterId, characterId)
        : isNull(characterDrafts.characterId),
      isNull(characterDrafts.deletedAt),
    ),
    columns: {
      data: true,
      prompt: true,
    },
    with: {
      characterDraftLocalizations: {
        where: and(
          eq(characterDraftLocalizations.locale, locale!),
          isNull(characterDraftLocalizations.deletedAt),
        ),
      },
      character: {
        columns: {
          id: true,
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
            columns: {
              name: true,
              description: true,
              instructions: true,
            },
            where: and(
              eq(characterLocalizations.locale, locale!),
              isNull(characterLocalizations.deletedAt),
            ),
          },
        },
      },
    },
  })

  if (!draftCharacter)
    throw noContent('There is no pending character draft')

  const existingDraft = draftCharacter.data

  return {
    draft: {
      username: existingDraft.username,
      name: draftCharacter.characterDraftLocalizations?.[0]?.name,
      description: draftCharacter.characterDraftLocalizations?.[0]?.description,
      instructions: draftCharacter.characterDraftLocalizations?.[0]?.instructions,
      prompt: draftCharacter.prompt,
      categoryName: getCharacterCategoryName(existingDraft.categoryId),
    },
    character: draftCharacter.character
      ? {
          id: draftCharacter.character.id,
          categoryName: getCharacterCategoryName(draftCharacter.character.categoryId),
          username: draftCharacter.character.usernames!.text,
          name: draftCharacter.character.characterLocalizations[0]!.name,
          description: draftCharacter.character.characterLocalizations[0]!.description,
          instructions: draftCharacter.character.characterLocalizations[0]!.instructions,
          discoverable: draftCharacter.character.discoverable,
        }
      : null,
  }
})
