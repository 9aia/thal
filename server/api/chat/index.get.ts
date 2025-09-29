import { sql } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~~/server/utils/h3'
import { unauthorized } from '~~/server/utils/nuxt'
import type { MessageStatus } from '~~/server/db/schema'
import { characterLocalizations, characters, chats, contacts, lastMessages, localeSchema, usernames } from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  const { search, locale } = await getValidated(event, 'query', z.object({
    search: z.string().optional().transform(s => s?.trim().toLowerCase()),
    locale: localeSchema,
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const searchLike = search ? `%${search}%` : null
  const { results } = await orm.run(sql`
    SELECT 
      ${chats.id} AS chatId,
      ${usernames.text} AS username,
      ${characterLocalizations.name} AS characterName,
      ${contacts.name} AS contactName,
      ${lastMessages.content} AS lastMessageContent,
      ${lastMessages.datetime} AS lastMessageDatetime,
      ${lastMessages.status} AS lastMessageStatus
    FROM 
      ${chats}
    LEFT JOIN 
      ${usernames} ON ${chats.usernameId} = ${usernames.id}
    LEFT JOIN 
      ${characters} ON ${usernames.characterId} = ${characters.id}
    LEFT JOIN 
      ${contacts} ON ${chats.contactId} = ${contacts.id}
    LEFT JOIN 
      ${lastMessages} ON ${chats.id} = ${lastMessages.chatId}
    LEFT JOIN
      ${characterLocalizations} ON ${characters.id} = ${characterLocalizations.characterId}
    WHERE
      ${chats.userId} = ${user.id}
      ${search
          ? sql`AND (lower(${contacts.name}) LIKE ${searchLike} OR lower(${usernames.text}) LIKE ${searchLike} OR lower(${characterLocalizations.name}) LIKE ${searchLike})`
          : sql``
      }
      AND (${characterLocalizations.locale} = ${locale} OR ${characterLocalizations.locale} IS NULL)
    ORDER BY 
      ${lastMessages.datetime} DESC;
  `)

  return results as {
    chatId: number
    username: string
    characterName: string
    contactName?: string
    lastMessageContent?: string
    lastMessageDatetime?: number
    lastMessageStatus?: MessageStatus
  }[]
})
