import { categories } from '~/constants/discover'
import { internal } from '~~/server/utils/nuxt'

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
