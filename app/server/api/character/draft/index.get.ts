import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getCharacterCategoryName } from '~/server/services/character'
import { getValidated } from '~/utils/h3'
import { badRequest, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import { characterDrafts } from '~~/db/schema'
import { numericString } from '~/utils/zod'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired()

  const { characterId } = await getValidated(event, 'query', z.object({ characterId: numericString(z.number().optional()) }))

  const draftCharacter = await orm.query.characterDrafts.findFirst({
    where: and(eq(characterDrafts.creatorId, user.id), characterId ? eq(characterDrafts.characterId, characterId) : isNull(characterDrafts.characterId)),
    columns: {
      data: true,
      prompt: true,
    },
  })

  if (!draftCharacter)
    throw badRequest('There is no pending character draft')

  const existingDraft = draftCharacter.data

  return {
    ...existingDraft,
    prompt: draftCharacter.prompt,
    categoryName: getCharacterCategoryName(existingDraft.categoryId),
  }
})
