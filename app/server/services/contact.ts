import { and, eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "lucia"
import { notFound } from "~/utils/nuxt"
import type { ContactEntity, ContactGetDto, PersonaGet } from "~~/db/schema"
import { contacts, personas } from "~~/db/schema"

export async function getContactByUser(
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
    })
    .from(contacts)
    .leftJoin(personas, eq(personas.username, username))
    .where(eq(contacts.userId, user.id))

  if (!contact)
    throw notFound("Contact not found")

  return contact
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
    })
    .from(contacts)
    .leftJoin(personas, eq(personas.id, contacts.personaId))
    .where(eq(contacts.userId, user.id))

  return foundContacts
}
