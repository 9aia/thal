import { z } from 'zod'
import { getContactByUser } from '~/server/services/contact'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))
  const { locale } = await getValidated(event, 'query', z.object({ locale: z.string() }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const contactGetDto = await getContactByUser(orm, user, username, locale)
  return contactGetDto
})
