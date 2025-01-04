import { and, eq, sql } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import { notFound } from '~/utils/nuxt'
import type { ContactEntity, ContactGetDto, PersonaGet, User } from '~~/db/schema'
import { contacts, personaUsernames, personas } from '~~/db/schema'

export async function getContactByUser(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const result = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    columns: {
      id: true,
      username: true,
    },
    with: {
      persona: {
        columns: {
          description: true,
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
    throw notFound('Persona Username not found')

  const persona = result.persona

  if (!persona)
    throw notFound('Persona not found')

  if (!result.contacts.length)
    throw notFound('Contact not found')

  return {
    id: result.contacts[0].id,
    name: result.contacts[0].name,
    username: result.username,
    description: result.persona?.description,
  }
}

export function mapContactToDto(contact: ContactEntity, persona: PersonaGet): ContactGetDto {
  return {
    id: contact.id,
    name: contact.name,
    createdAt: contact.createdAt,
    username: persona.username,

  }
}

export async function getContactWithPersonaByUser(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const [contact] = await orm
    .select({
      id: contacts.id,
      name: contacts.name,
      createdAt: contacts.createdAt,
      username: personaUsernames.username,
      personaUsernameId: personaUsernames.id,
    })
    .from(contacts)
    .leftJoin(personaUsernames, eq(personaUsernames.id, contacts.personaUsernameId))
    .leftJoin(personas, eq(personas.id, personaUsernames.personaId))
    .where(and(eq(contacts.userId, user.id!), eq(personaUsernames.username, username)))

  if (!contact)
    throw notFound('Contact not found')

  return contact
}

export async function getContactsWithPersonaByUser(
  orm: H3EventContext['orm'],
  user: User,
  search?: string,
) {
  const searchLike = search ? `%${search}%` : null
  const { results } = await orm.run(sql`
      SELECT 
        ${contacts.id} AS contactId,
        ${contacts.name} AS contactName,
        ${personaUsernames.username} AS personaUsername,
        ${personas.description} AS personaDescription
      FROM 
        ${contacts}
      LEFT JOIN 
        ${personaUsernames} ON ${contacts.personaUsernameId} = ${personaUsernames.id}
      LEFT JOIN 
        ${personas} ON ${personaUsernames.personaId} = ${personas.id}
      WHERE
        ${contacts.userId} = ${user.id}
        ${search
            ? sql`AND (lower(${contacts.name}) LIKE ${searchLike} OR lower(${personaUsernames.username}) LIKE ${searchLike} OR lower(${personas.name}) LIKE ${searchLike})`
            : sql``
        }
    `)

  return results as {
    contactId: number
    contactName: string
    personaUsername: string
    personaDescription: string
  }[]
}
