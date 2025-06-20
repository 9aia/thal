import { eq } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import { categories } from '~/constants/discover'
import { internal, notFound } from '~/utils/nuxt'
import type { User } from '~~/db/schema'
import { characterLocalizations, contacts, usernames } from '~~/db/schema'

export async function getCharacterByUsername(
  orm: H3EventContext['orm'],
  username: string,
) {
  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.username, username),
    with: {
      character: true,
    },
  })

  if (!result)
    throw notFound('Username not found')

  const character = result?.character

  if (!character) {
    return {
      username,
      usernameId: result.id,
    }
  }

  return {
    ...character,
    username,
    usernameId: result.id,
  }
}

// TODO: remove this
export async function getCharacterWithContactByUser(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
  locale: string,
) {
  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.username, username),
    with: {
      character: {
        columns: {
          id: true,
        },
        with: {
          characterLocalizations: {
            columns: {
              name: true,
              description: true,
              instructions: true,
            },
            where: eq(characterLocalizations.locale, locale),
          },
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
    throw notFound('Username not found')

  const character = result.character

  const contact = {
    id: result.contacts[0]?.id,
    name: result.contacts[0]?.name,
  }

  const localization = character?.characterLocalizations?.[0]

  return {
    id: character?.id,
    username: result.username,
    description: localization?.description,
    name: localization?.name,
    instructions: localization?.instructions,
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
