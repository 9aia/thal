import { z } from 'zod'
import { getContactsWithCharacterByUser } from '~/server/services/contact'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const { search, locale } = await getValidated(event, 'query', z.object({
    search: z.string().optional().transform(s => s?.trim().toLowerCase()),
    locale: z.enum(['pt-BR', 'en-US']),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  return []

  const foundContacts = getContactsWithCharacterByUser(orm, user, locale, search)
  return foundContacts
})
