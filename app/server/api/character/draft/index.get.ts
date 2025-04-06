import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getCharacterCategoryName } from '~/server/services/character'
import { getValidated } from '~/utils/h3'
import { badRequest, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import { characterDraftLocalizations, characterDraftLocalizationsRelations, characterDrafts } from '~~/db/schema'
import { numericString } from '~/utils/zod'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired()

  const { characterId, locale } = await getValidated(event, 'query', z.object({ characterId: numericString(z.number().optional()), locale: z.string() }))

  const draftCharacter = await orm.query.characterDrafts.findFirst({
    where: and(eq(characterDrafts.creatorId, user.id), characterId ? eq(characterDrafts.characterId, characterId) : isNull(characterDrafts.characterId)),
    columns: {
      data: true,
      prompt: true,
    },
    with: {
      characterDraftLocalizations: {
        where: eq(characterDraftLocalizations.locale, locale),
      },
    },
  })

  if (!draftCharacter)
    throw badRequest('There is no pending character draft')

  const existingDraft = draftCharacter.data

  return {
    ...existingDraft,
    name: draftCharacter.characterDraftLocalizations?.[0]?.name,
    description: draftCharacter.characterDraftLocalizations?.[0]?.description,
    instructions: draftCharacter.characterDraftLocalizations?.[0]?.instructions,
    prompt: draftCharacter.prompt,
    categoryName: getCharacterCategoryName(existingDraft.categoryId),
  }
})
