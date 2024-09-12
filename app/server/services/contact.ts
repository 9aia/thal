import { and, eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "lucia"
import { notFound } from "~/utils/nuxt"
import type { NonNullableKeys } from "~/utils/types"
import { type ContactEntity, type ContactGetDto, type PersonaGet, contacts, personas } from "~~/db/schema"

export async function getContactByUser(
  orm: H3EventContext["orm"],
  user: User,
  username: string,
) {
  const result = await orm.query.personas.findFirst({
    columns: {
      id: true,
      username: true,
      description: true,
    },
    where: eq(personas.username, username),
    with: {
      contacts: {
        columns: {
          id: true,
          name: true,
        },
        where: eq(contacts.userId, user.id),
      },
    },
  })

  if (!result || !result.contacts.length)
    throw notFound("Contact not found")

  return {
    id: result.contacts[0].id,
    personaId: result.id,
    name: result.contacts[0].name,
    username: result.username,
    description: result.description,
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
  orm: H3EventContext["orm"],
  user: User,
  username: string,
) {
  const [contact] = await orm
    .select({
      id: contacts.id,
      name: contacts.name,
      createdAt: contacts.createdAt,
      username: personas.username,
      personaId: contacts.personaId,
    })
    .from(contacts)
    .leftJoin(personas, eq(personas.id, contacts.personaId))
    .where(and(eq(contacts.userId, user.id), eq(personas.username, username)))

  if (!contact)
    throw notFound("Contact not found")

  return contact
}

export async function getContactsWithPersonaByUser(
  orm: H3EventContext["orm"],
  user: User,
) {
  const foundContacts = await orm
    .select({
      id: contacts.id,
      name: contacts.name,
      createdAt: contacts.createdAt,
      username: personas.username,
      description: personas.description,
    })
    .from(contacts)
    .leftJoin(personas, eq(personas.id, contacts.personaId))
    .where(eq(contacts.userId, user.id))

  return foundContacts as NonNullableKeys<typeof foundContacts[number]>[]
}
