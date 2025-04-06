import { z } from 'zod'
import { getContactsWithCharacterByUser } from '~/server/services/contact'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { search, locale } = await getValidated(event, 'query', z.object({
    search: z.string().optional().transform(s => s?.trim().toLowerCase()),
    locale: z.enum(['pt-BR', 'en-US']),
  }))

  if (!user)
    throw unauthorized()

  const foundContacts = getContactsWithCharacterByUser(orm, user, locale, search)
  return foundContacts
})
