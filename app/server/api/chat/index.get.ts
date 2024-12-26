import { and, eq, inArray, or, sql } from "drizzle-orm"
import { z } from "zod"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { chats, contacts, lastMessages, personaUsernames, personas } from "~~/db/schema"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { search } = await getValidated(event, "query", z.object({
    search: z.string().optional().transform(s => s?.trim()),
  }))

  if (!user)
    throw unauthorized()

  const preparedContacts = (orm.query.contacts.findMany({
    where: contacts => search ? sql`lower(${contacts.name}) like ${sql.placeholder("search")}` : undefined,
    columns: {
      id: true,
    },
  })).prepare()

  const contactIds = (await preparedContacts.execute({ search: `%${search}%` })).map(r => r.id)

  console.log("contactIds", contactIds, search)

  const preparedUsernames = (orm.query.personaUsernames.findMany({
    where: personaUsernames => search ? sql`lower(${personaUsernames.username}) like ${sql.placeholder("search")}` : undefined,
    columns: {
      id: true,
    },
  })).prepare()

  const usernameIds = (await preparedUsernames.execute({ search: `%${search}%` })).map(r => r.id)

  const prepared = orm.query.chats.findMany({
    where: and(
      eq(chats.userId, user.id!),
      or(
        inArray(chats.personaUsernameId, usernameIds),
        inArray(chats.contactId, contactIds),
      ),
    ),
    columns: {
      id: true,
    },
    with: {
      personaUsername: {
        columns: {
          username: true,
        },
        with: {
          persona: {
            columns: {
              name: true,
            },
          },
          contacts: {
            columns: {
              name: true,
            },
          },
        },
      },
      lastMessages: {
        columns: {
          chatId: true,
          content: true,
          datetime: true,
        },
      },
    },
  }).prepare()

  const result = await prepared.execute({ search: `%${search}%` })

  return result
})
