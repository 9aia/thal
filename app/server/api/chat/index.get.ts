import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { chats, contacts, lastMessages, personaUsernames, personas } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { search } = await getValidated(event, 'query', z.object({
    search: z.string().optional().transform(s => s?.trim().toLowerCase()),
  }))

  if (!user)
    throw unauthorized()

  const searchLike = search ? `%${search}%` : null
  const { results } = await orm.run(sql`
    SELECT 
      ${chats.id} AS chatId,
      ${personaUsernames.username} AS personaUsername,
      ${personas.name} AS personaName,
      ${contacts.name} AS contactName,
      ${lastMessages.content} AS lastMessageContent,
      ${lastMessages.datetime} AS lastMessageDatetime
    FROM 
      ${chats}
    LEFT JOIN 
      ${personaUsernames} ON ${chats.personaUsernameId} = ${personaUsernames.id}
    LEFT JOIN 
      ${personas} ON ${personaUsernames.personaId} = ${personas.id}
    LEFT JOIN 
      ${contacts} ON ${chats.contactId} = ${contacts.id}
    LEFT JOIN 
      ${lastMessages} ON ${chats.id} = ${lastMessages.chatId}
    WHERE
      ${chats.userId} = ${user.id}
      ${search
          ? sql`AND (lower(${contacts.name}) LIKE ${searchLike} OR lower(${personaUsernames.username}) LIKE ${searchLike} OR lower(${personas.name}) LIKE ${searchLike})`
          : sql``
      }
    ORDER BY 
      ${lastMessages.datetime} DESC;
  `)

  return results as {
    chatId: number
    personaUsername: string
    personaName: string
    contactName?: string
    lastMessageContent?: string
    lastMessageDatetime?: number
  }[]
})
