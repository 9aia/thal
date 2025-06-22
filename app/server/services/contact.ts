import { and, eq, sql } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import { notFound } from '~/utils/nuxt'
import type { User } from '~~/db/schema'
import { characterLocalizations, characters, contacts, usernames } from '~~/db/schema'

export async function getContactByUsername(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.text, username),
    with: {
      contacts: {
        where: eq(contacts.userId, user.id!),
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
  })

  if (!result)
    throw notFound('Username not found')

  if (!result.contacts.length) {
    return {
      id: null,
      name: null,
      createdAt: null,
      username,
    }
  }

  return {
    id: result.contacts[0].id,
    name: result.contacts[0].name,
    createdAt: result.contacts[0].createdAt,
    username,
  }
}

export async function getContactWithCharacterByUser(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const [contact] = await orm
    .select({
      id: contacts.id,
      name: contacts.name,
      createdAt: contacts.createdAt,
      username: usernames.text,
      usernameId: usernames.id,
    })
    .from(contacts)
    .leftJoin(usernames, eq(usernames.id, contacts.usernameId))
    .leftJoin(characters, eq(characters.id, usernames.characterId))
    .where(and(eq(contacts.userId, user.id!), eq(usernames.text, username)))

  if (!contact)
    throw notFound('Contact not found')

  return contact
}

export async function getContactsWithCharacterByUser(
  orm: H3EventContext['orm'],
  user: User,
  locale: string,
  search?: string,
) {
  const searchLike = search ? `%${search}%` : null
  const { results } = await orm.run(sql`
      SELECT 
        ${contacts.id} AS contactId,
        ${contacts.name} AS contactName,
        ${usernames.text} AS username,
        ${characterLocalizations.description} AS characterDescription
      FROM 
        ${contacts}
      LEFT JOIN 
        ${usernames} ON ${contacts.usernameId} = ${usernames.id}
      LEFT JOIN 
        ${characters} ON ${usernames.characterId} = ${characters.id}
      LEFT JOIN
        ${characterLocalizations} ON ${characters.id} = ${characterLocalizations.characterId}
      WHERE
        ${contacts.userId} = ${user.id}
        ${search
            ? sql`AND (lower(${contacts.name}) LIKE ${searchLike} OR lower(${usernames.text}) LIKE ${searchLike} OR lower(${characterLocalizations.name}) LIKE ${searchLike})`
            : sql``
        }
        AND ${characterLocalizations.locale} = ${locale}
    `)

  return results as {
    contactId: number
    contactName: string
    username: string
    characterDescription: string
  }[]
}
