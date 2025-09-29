import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { now } from '#shared/utils/date'
import { getValidated } from '~~/server/utils/h3'
import { badRequest, paymentRequired, unauthorized } from '~~/server/utils/nuxt'
import { canUseAIFeatures } from '#shared/utils/plan'
import { characterDraftLocalizations, characterDrafts, characters } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const { characterId } = await getValidated(event, 'body', z.object({
    characterId: z.number().optional(),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (!canUseAIFeatures(user))
    throw paymentRequired()

  const existingDraft = await orm.query.characterDrafts.findFirst({
    where: and(
      eq(characterDrafts.creatorId, user.id),
      characterId
        ? eq(characterDrafts.characterId, characterId)
        : isNull(characterDrafts.characterId),
      isNull(characterDrafts.deletedAt),
    ),
    with: {
      characterDraftLocalizations: {
        where: and(
          eq(characterDraftLocalizations.locale, 'en-US'),
          isNull(characterDraftLocalizations.deletedAt),
        ),
      },
      character: !characterId
        ? undefined
        : {
            columns: {
              categoryId: true,
            },
          },
    },
  })

  if (!existingDraft) {
    throw badRequest(characterId
      ? `You do not have a pending character draft for \`characterId\` ${characterId}`
      : 'You do not have a pending character draft')
  }

  if (characterId) {
    const character = await orm.query.characters.findFirst({
      where: eq(characters.id, characterId),
      with: {
        characterLocalizations: true,
        usernames: true,
      },
    })

    if (!character)
      throw badRequest(`Character with \`characterId\` ${characterId} not found`)

    const ptLocalization = character.characterLocalizations.find(localization => localization.locale === 'pt-BR')
    const enLocalization = character.characterLocalizations.find(localization => localization.locale === 'en-US')

    await orm.batch([
      orm.update(characterDrafts).set({
        id: existingDraft.id,
        creatorId: user.id,
        characterId: character.id,
        prompt: character.prompt,
        data: {
          username: character.usernames!.text,
          categoryId: character.categoryId,
        },
        updatedAt: now(),
      }).where(eq(characterDrafts.id, existingDraft.id)),
      orm.update(characterDraftLocalizations).set({
        name: ptLocalization?.name,
        description: ptLocalization?.description,
        instructions: ptLocalization?.instructions,
        locale: 'pt-BR',
        characterDraftId: existingDraft.id,
        updatedAt: now(),
      }).where(and(
        eq(characterDraftLocalizations.locale, 'pt-BR'),
        eq(characterDraftLocalizations.characterDraftId, existingDraft.id),
      )),
      orm.update(characterDraftLocalizations).set({
        name: enLocalization?.name,
        description: enLocalization?.description,
        instructions: enLocalization?.instructions,
        locale: 'en-US',
        characterDraftId: existingDraft.id,
        updatedAt: now(),
      }).where(and(
        eq(characterDraftLocalizations.locale, 'en-US'),
        eq(characterDraftLocalizations.characterDraftId, existingDraft.id),
      )),
    ])
  }
  else {
    await orm.batch([
      orm.update(characterDrafts)
        .set({
          deletedAt: now(),
        })
        .where(eq(characterDrafts.id, existingDraft.id)),
      orm.update(characterDraftLocalizations)
        .set({
          deletedAt: now(),
        })
        .where(eq(characterDraftLocalizations.characterDraftId, existingDraft.id)),
    ])
  }
})
