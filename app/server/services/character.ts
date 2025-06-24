import { eq } from 'drizzle-orm'
import type { H3EventContext } from 'h3'
import { categories } from '~/constants/discover'
import { internal, notFound } from '~/utils/nuxt'
import { usernames } from '~~/db/schema'

export async function getCharacterByUsername(
  orm: H3EventContext['orm'],
  username: string,
) {
  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.text, username),
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
