import { eq } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import { categories } from '~/constants/discover'
import { internal, notFound } from '~/utils/nuxt'
import type { User } from '~~/db/schema'
import { characterUsernames, contacts } from '~~/db/schema'

export async function getCharacterByUsername(
  orm: H3EventContext['orm'],
  username: string,
) {
  const result = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: true,
    },
  })

  const character = result?.character

  if (!character)
    throw notFound('Character not found')

  return {
    ...character,
    username,
    characterUsernameId: result.id,
  }
}

export async function getCharacterWithContactByUser(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const result = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: {
        columns: {
          id: true,
          description: true,
          name: true,
        },
      },
      contacts: {
        columns: {
          id: true,
          name: true,
        },
        where: eq(contacts.userId, user.id!),
      },
    },
  })

  if (!result)
    throw notFound('Character Username not found')

  const character = result.character

  if (!character)
    throw notFound('Character not found')

  const contact = {
    name: result.contacts[0]?.name,
  }

  return {
    id: character.id,
    username: result.username,
    description: character.description,
    name: character.name,
    contact: result.contacts[0] ? contact : null,
  }
}

export function getCharacterCategoryId(categoryName: string) {
  const categoryId = categories.find(category => category.name === categoryName)?.id

  if (!categoryId)
    throw internal(`Category not found: ${categoryName}`)

  return categoryId
}

export function getCharacterCategoryName(categoryId: number) {
  const category = categories.find(category => category.id === categoryId)

  if (!category)
    throw internal(`Category not found: ${categoryId}`)

  return category.name
}
