import { z } from 'zod'
import { getHistory } from '~/server/services/messages'
import { getCharacterWithContactByUser } from '~/server/services/character'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({
    username: usernameSchema,
  }))
  const { locale } = await getValidated(event, 'query', z.object({
    locale: z.enum(['pt-BR', 'en-US']),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const characterWithContact = await getCharacterWithContactByUser(orm, user, username, locale)

  const { history, chatId } = await getHistory(orm, user, username)

  return { ...characterWithContact, history, chatId }
})
