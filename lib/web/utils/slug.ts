function slug(name: string) {
  // Convert the input string to lowercase
  let slug = name.toLowerCase()

  // Normalize index
  slug = slug.replace('index', '')

  // Remove special characters, symbols, and spaces
  slug = slug.replace(/[^\w\s-]/g, '')

  // Remove diacritical marks or accents
  slug = slug.normalize('NFD')
  slug = slug.replace(/[\u0300-\u036F]/g, '')

  // Replace spaces with hyphens
  slug = slug.replace(/\s+/g, '-')

  // Remove any extra hyphens at the beginning or end
  slug = slug.replace(/^-+|-+$/g, '')

  return slug
}

export default slug
