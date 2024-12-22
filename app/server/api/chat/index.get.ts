import { and, eq, or, sql } from "drizzle-orm"
import { z } from "zod"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { chats, contacts, lastMessages, personaUsernames, personas } from "~~/db/schema"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { search } = await getValidated(event, "query", z.object({
    search: z.string().optional(),
  }))

  if (!user)
    throw unauthorized()

  console.log(search)

  const ormQuery = orm.select({
    id: chats.id,
    contact: {
      name: contacts.name,
    },
    lastMessages: {
      chatId: lastMessages.chatId,
      content: lastMessages.content,
      datetime: lastMessages.datetime,
    },
    personaUsername: {
      username: personaUsernames.username,
    },
    persona: {
      name: personas.name,
    },
  }).from(chats)
    .leftJoin(contacts, eq(contacts.id, chats.contactId))
    .leftJoin(personaUsernames, eq(personaUsernames.id, chats.personaUsernameId))
    .leftJoin(personas, eq(personas.id, personaUsernames.personaId))
    .leftJoin(lastMessages, eq(lastMessages.chatId, chats.id))
    .where(and(
      or(
        search
          ? sql`lower(${contacts.name}) like ${sql.placeholder("search")}`
          : undefined,
        search
          ? sql`lower(${personaUsernames.username}) like ${sql.placeholder("search")}`
          : undefined,
        search
          ? sql`lower(${personas.name}) like ${sql.placeholder("search")}`
          : undefined,
      ),
      eq(chats.userId, user.id!),
    )).prepare()

  // const ormQuery = orm.query.chats.findMany({
  //   with: {
  //     personaUsername: {
  //       with: {
  //         persona: {
  //           columns: {
  //             name: true,
  //           },
  //         },
  //       },
  //     },
  //   },
  // }).prepare()

  const result = await ormQuery.execute({ search: `%${search}%` })

  return result
})
