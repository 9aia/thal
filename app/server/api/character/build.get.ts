import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getCharacterCategoryName } from '~/server/services/character'
import { getValidated } from '~/utils/h3'
import { noContent, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import { characterDraftLocalizations, characterDrafts, characterLocalizations } from '~~/db/schema'
import { numericString } from '~/utils/zod'

export default eventHandler(async (event) => {
  const { characterId, locale } = await getValidated(event, 'query', z.object({
    characterId: numericString(z.number().optional()),
    locale: z.string(),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired()

  const draftCharacter = await orm.query.characterDrafts.findFirst({
    where: and(
      eq(characterDrafts.creatorId, user.id),
      characterId
        ? eq(characterDrafts.characterId, characterId)
        : isNull(characterDrafts.characterId),
    ),
    columns: {
      data: true,
      prompt: true,
    },
    with: {
      characterDraftLocalizations: {
        where: eq(characterDraftLocalizations.locale, locale),
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
            where: eq(characterLocalizations.locale, locale),
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
