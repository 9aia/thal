import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { characterLocalizations, characterUsernames, characters, chats, contacts, lastMessages } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { search, locale } = await getValidated(event, 'query', z.object({
    search: z.string().optional().transform(s => s?.trim().toLowerCase()),
    locale: z.enum(['pt-BR', 'en-US']),
  }))

  if (!user)
    throw unauthorized()

  const searchLike = search ? `%${search}%` : null
  const { results } = await orm.run(sql`
    SELECT 
      ${chats.id} AS chatId,
      ${characterUsernames.username} AS characterUsername,
      ${characterLocalizations.name} AS characterName,
      ${contacts.name} AS contactName,
      ${lastMessages.content} AS lastMessageContent,
      ${lastMessages.datetime} AS lastMessageDatetime
    FROM 
      ${chats}
    LEFT JOIN 
      ${characterUsernames} ON ${chats.characterUsernameId} = ${characterUsernames.id}
    LEFT JOIN 
      ${characters} ON ${characterUsernames.characterId} = ${characters.id}
    LEFT JOIN 
      ${contacts} ON ${chats.contactId} = ${contacts.id}
    LEFT JOIN 
      ${lastMessages} ON ${chats.id} = ${lastMessages.chatId}
    LEFT JOIN
      ${characterLocalizations} ON ${characters.id} = ${characterLocalizations.characterId}
    WHERE
      ${chats.userId} = ${user.id}
      ${search
          ? sql`AND (lower(${contacts.name}) LIKE ${searchLike} OR lower(${characterUsernames.username}) LIKE ${searchLike} OR lower(${characterLocalizations.name}) LIKE ${searchLike})`
          : sql``
      }
      AND ${characterLocalizations.locale} = ${locale}
    ORDER BY 
      ${lastMessages.datetime} DESC;
  `)

  return results as {
    chatId: number
    characterUsername: string
    characterName: string
    contactName?: string
    lastMessageContent?: string
    lastMessageDatetime?: number
  }[]
})
