import { getContactsWithPersonaByUser } from "~/server/services/contact"
import { unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const foundContacts = getContactsWithPersonaByUser(orm, user)
  return foundContacts
})
