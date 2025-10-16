import { categories } from '../constants/discover'

export function getCategoryById(categoryId: number) {
  const category = categories.find(category => category.id === categoryId)

  if (!category)
    return

  return category
}
