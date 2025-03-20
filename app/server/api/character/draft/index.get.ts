import { and, eq, isNull } from 'drizzle-orm'
import { getCharacterCategoryName } from '~/server/services/character'
import { badRequest, internal, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import { characterDrafts } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired()

  const draftCharacter = await orm.query.characterDrafts.findFirst({
    where: and(eq(characterDrafts.creatorId, user.id), isNull(characterDrafts.characterId)),
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
