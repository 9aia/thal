export interface Category {
  id: number
  name: string
  icon: string
  description: string
  example: string
  color: string
}

const t = (x: string) => x

export const categories: Category[] = [
  {
    id: 1,
    name: t('Travel, Tourism & Transportation'),
    icon: 'material-symbols:flight-takeoff',
    description: 'Practice conversations for traveling abroad, including booking accommodations, asking for directions, and more.',
    example: 'A hotel receptionist or a local tour guide.',
    color: 'text-gray-500 bg-gray-50',
  },
  {
    id: 2,
    name: t('Shopping & Retail'),
    icon: 'material-symbols:storefront-outline',
    description: 'Characters in a retail setting, such as shopping for clothes, groceries, or electronics, designed to practice consumer interactions.',
    example: 'A salesperson or a barber.',
    color: 'text-orange-500 bg-gray-50',
  },
  {
    id: 3,
    name: t('Food & Beverage'),
    icon: 'material-symbols:restaurant-menu',
    description: 'Characters for practicing conversations in restaurants, cafes, and food-related situations like menu ordering, dietary preferences, and cooking.',
    example: 'A chef or a waiter.',
    color: 'text-gray-500 bg-gray-50',
  },
  {
    id: 4,
    name: t('Science & Nature'),
    icon: 'material-symbols:science-outline',
    description: 'Characters discussing scientific topics, nature, and environmental issues.',
    example: 'A biologist or an environmentalist.',
    color: 'text-green-500 bg-gray-50',
  },
  {
    id: 5,
    name: t('Dating & Relationships'),
    icon: 'material-symbols:favorite-outline',
    description: 'Characters for practicing conversations related to dating, relationships, and social interactions.',
    example: 'A romantic partner or a friend.',
    color: 'text-red-500 bg-gray-50',
  },
  {
    id: 6,
    name: t('Education & Learning'),
    icon: 'material-symbols:school-outline',
    description: 'Simulate discussions in educational settings, from classroom dialogues to study groups.',
    example: 'A professor or a classmate.',
    color: 'text-green-500 bg-gray-50',
  },
  {
    id: 7,
    name: t('Health & Wellness'),
    icon: 'material-symbols:local-hospital-outline',
    description: 'Characters that discuss health, fitness, mental well-being, and lifestyle topics.',
    example: 'A doctor or a first responder.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 8,
    name: t('Technology & Engineering'),
    icon: 'material-symbols:memory-outline',
    description: 'Characters discussing tech trends, engineering concepts, and digital innovations.',
    example: 'A software engineer or a tech entrepreneur.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 9,
    name: t('Historical Figures'),
    icon: 'material-symbols:history-edu-outline',
    description: 'Interact with simulated characters from different historical eras to learn about their lives and achievements.',
    example: 'A Victorian-era gentleman or a World War II soldier.',
    color: 'text-orange-500 bg-gray-50',
  },
  {
    id: 10,
    name: t('Business & Career'),
    icon: 'material-symbols:work-outline',
    description: 'Focused on professional settings, such as meetings, emails, and workplace interactions.',
    example: 'A CEO or a recruiter.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 11,
    name: t('Family & Relatives'),
    icon: 'material-symbols:family-restroom',
    description: 'Focused on family dynamics, parenting, and relationships between relatives.',
    example: 'A parent or a uncle.',
    color: 'text-red-500 bg-gray-50',
  },
  {
    id: 12,
    name: t('Law & Justice'),
    icon: 'material-symbols:gavel-rounded',
    description: 'Characters discussing legal matters, court cases, and justice-related topics.',
    example: 'A lawyer or a police officer.',
    color: 'text-red-500 bg-gray-50',
  },
  {
    id: 13,
    name: t('Religion & Spirituality'),
    icon: 'material-symbols:church-outline',
    description: 'Characters discussing religious beliefs, spiritual practices, and philosophical topics.',
    example: 'A priest or a spiritual guru.',
    color: 'text-magenta-500 bg-gray-50',
  },
  {
    id: 14,
    name: t('Sports & recreation'),
    icon: 'material-symbols:sports-soccer',
    description: 'Characters discussing sports, fitness, and recreational activities.',
    example: 'A coach or a fitness trainer.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 15,
    name: t('Hotel & Lodging'),
    icon: 'material-symbols:hotel-outline',
    description: 'Characters for practicing conversations in hotels, hostels, and other lodging situations.',
    example: 'A hotel receptionist or a concierge.',
    color: 'text-brown-500 bg-gray-50',
  },
  {
    id: 16,
    name: t('Comedy & Entertainment'),
    icon: 'material-symbols:movie-outline',
    description: 'Characters related to the entertainment industry, including actors, comedians, and performers.',
    example: 'A movie star or a music producer.',
    color: 'text-gray-500 bg-gray-50',
  },
  {
    id: 17,
    name: t('Real Estate'),
    icon: 'material-symbols:house-outline',
    description: 'Characters for practicing conversations in real estate, including buying, selling, or renting properties.',
    example: 'A real estate agent or a property manager.',
    color: 'text-orange-500 bg-gray-50',
  },
  {
    id: 18,
    name: t('Art & Design'),
    icon: 'material-symbols:palette-outline',
    description: 'Characters related to art, design, and creative fields.',
    example: 'An artist or a graphic designer.',
    color: 'text-magenta-500 bg-gray-50',
  },
  {
    id: 19,
    name: t('Casual & Everyday'),
    icon: 'material-symbols:chat-outline',
    description: 'Characters for casual conversations about everyday life, hobbies, and interests.',
    example: 'A friendly neighbor or a fellow commuter.',
    color: 'text-orange-500 bg-gray-50',
  },
  {
    id: 20,
    name: t('News & Media'),
    icon: 'material-symbols:article-outline',
    description: 'Characters discussing current events, news stories, and media topics.',
    example: 'A journalist or a news anchor.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 21,
    name: t('Miscellaneous & Others'),
    icon: 'material-symbols:more-vert',
    description: 'Characters that don\'t fit into other categories.',
    example: 'A character with a unique background or profession.',
    color: 'text-gray-500 bg-gray-50',
  },
].sort((a, b) => a.name.localeCompare(b.name))

// print the categories names and their desc with a example
// categories.forEach((category) => {
//   console.log(`${category.name}: ${category.description} Example: ${category.example}\n`)
// })
