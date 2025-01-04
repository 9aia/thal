import { z } from 'zod'
import { getContactsWithPersonaByUser } from '~/server/services/contact'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { search } = await getValidated(event, 'query', z.object({
    search: z.string().optional().transform(s => s?.trim().toLowerCase()),
  }))

  if (!user)
    throw unauthorized()

  const foundContacts = getContactsWithPersonaByUser(orm, user, search)
  return foundContacts
})
