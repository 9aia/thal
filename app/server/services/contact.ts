import { and, eq, sql } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import { notFound } from '~/utils/nuxt'
import type { User } from '~~/db/schema'
import { characterLocalizations, characters, contacts, usernames } from '~~/db/schema'

export async function getContactByUser(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
  locale: string,
) {
  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.username, username),
    columns: {
      id: true,
      username: true,
    },
    with: {
      character: {
        with: {
          characterLocalizations: {
            where: eq(characterLocalizations.locale, locale),
            columns: {
              description: true,
            },
          },
        },
      },
      contacts: {
        where: eq(contacts.userId, user.id!),
        columns: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!result)
    throw notFound('Character Username not found')

  if (!result.contacts.length)
    throw notFound('Contact not found')

  return {
    id: result.contacts[0].id,
    name: result.contacts[0].name,
    username: result.username,
    description: result.character?.characterLocalizations[0]?.description,
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
      username: usernames.username,
      usernameId: usernames.id,
    })
    .from(contacts)
    .leftJoin(usernames, eq(usernames.id, contacts.usernameId))
    .leftJoin(characters, eq(characters.id, usernames.characterId))
    .where(and(eq(contacts.userId, user.id!), eq(usernames.username, username)))

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
        ${usernames.username} AS username,
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
            ? sql`AND (lower(${contacts.name}) LIKE ${searchLike} OR lower(${usernames.username}) LIKE ${searchLike} OR lower(${characterLocalizations.name}) LIKE ${searchLike})`
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
