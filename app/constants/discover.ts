export interface Category {
  id: number
  name: string
  icon: string
  description: string
  example: string
  color: string
}

export const categories: Category[] = [
  {
    id: 1,
    name: 'Travel, Tourism & Transportation',
    icon: 'flight_takeoff',
    description: 'Practice conversations for traveling abroad, including booking accommodations, asking for directions, and more.',
    example: 'A hotel receptionist or a local tour guide.',
    color: 'bg-blue-100',
  },
  {
    id: 2,
    name: 'Shopping & Retail',
    icon: 'storefront',
    description: 'Characters in a retail setting, such as shopping for clothes, groceries, or electronics, designed to practice consumer interactions.',
    example: 'A salesperson or a barber.',
    color: 'bg-blue-100',
  },
  {
    id: 3,
    name: 'Food & Beverage',
    icon: 'restaurant_menu',
    description: 'Characters for practicing conversations in restaurants, cafes, and food-related situations like menu ordering, dietary preferences, and cooking.',
    example: 'A chef or a waiter.',
    color: 'bg-red-100',
  },
  {
    id: 4,
    name: 'Science & Nature',
    icon: 'science',
    description: 'Characters discussing scientific topics, nature, and environmental issues.',
    example: 'A biologist or an environmentalist.',
    color: 'bg-green-100',
  },
  {
    id: 5,
    name: 'Dating & Relationships',
    icon: 'favorite',
    description: 'Characters for practicing conversations related to dating, relationships, and social interactions.',
    example: 'A romantic partner or a friend.',
    color: 'bg-brown-100',
  },
  {
    id: 6,
    name: 'Education & Learning',
    icon: 'school',
    description: 'Simulate discussions in educational settings, from classroom dialogues to study groups.',
    example: 'A professor or a classmate.',
    color: 'bg-green-100',
  },
  {
    id: 7,
    name: 'Health & Wellness',
    icon: 'local_hospital',
    description: 'Characters that discuss health, fitness, mental well-being, and lifestyle topics.',
    example: 'A doctor or a first responder.',
    color: 'bg-blue-100',
  },
  {
    id: 8,
    name: 'Technology & Engineering',
    icon: 'memory',
    description: 'Characters discussing tech trends, engineering concepts, and digital innovations.',
    example: 'A software engineer or a tech entrepreneur.',
    color: 'bg-cyan-100',
  },
  {
    id: 9,
    name: 'Historical Figures',
    icon: 'history_edu',
    description: 'Interact with simulated characters from different historical eras to learn about their lives and achievements.',
    example: 'A Victorian-era gentleman or a World War II soldier.',
    color: 'bg-yellow-100',
  },
  {
    id: 10,
    name: 'Business & Career',
    icon: 'work',
    description: 'Focused on professional settings, such as meetings, emails, and workplace interactions.',
    example: 'A CEO or a recruiter.',
    color: 'bg-blue-100',
  },
  {
    id: 11,
    name: 'Family & Relatives',
    icon: 'family_restroom',
    description: 'Focused on family dynamics, parenting, and relationships between relatives.',
    example: 'A parent or a uncle.',
    color: 'bg-yellow-100',
  },
  {
    id: 12,
    name: 'Law & Justice',
    icon: 'gavel',
    description: 'Characters discussing legal matters, court cases, and justice-related topics.',
    example: 'A lawyer or a police officer.',
    color: 'bg-red-100',
  },
  {
    id: 13,
    name: 'Religion & Spirituality',
    icon: 'church',
    description: 'Characters discussing religious beliefs, spiritual practices, and philosophical topics.',
    example: 'A priest or a spiritual guru.',
    color: 'bg-magenta-100',
  },
  {
    id: 14,
    name: 'Sports & recreation',
    icon: 'sports_soccer',
    description: 'Characters discussing sports, fitness, and recreational activities.',
    example: 'A coach or a fitness trainer.',
    color: 'bg-green-100',
  },
  {
    id: 15,
    name: 'Hotel & Lodging',
    icon: 'hotel',
    description: 'Characters for practicing conversations in hotels, hostels, and other lodging situations.',
    example: 'A hotel receptionist or a concierge.',
    color: 'bg-cyan-100',
  },
  {
    id: 16,
    name: 'Comedy & Entertainment',
    icon: 'movie',
    description: 'Characters related to the entertainment industry, including actors, comedians, and performers.',
    example: 'A movie star or a music producer.',
    color: 'bg-yellow-100',
  },
  {
    id: 17,
    name: 'Real Estate',
    icon: 'house',
    description: 'Characters for practicing conversations in real estate, including buying, selling, or renting properties.',
    example: 'A real estate agent or a property manager.',
    color: 'bg-yellow-100',
  },
  {
    id: 18,
    name: 'Art & Design',
    icon: 'palette',
    description: 'Characters related to art, design, and creative fields.',
    example: 'An artist or a graphic designer.',
    color: 'bg-magenta-100',
  },
  {
    id: 19,
    name: 'Casual & Everyday',
    icon: 'chat',
    description: 'Characters for casual conversations about everyday life, hobbies, and interests.',
    example: 'A friendly neighbor or a fellow commuter.',
    color: 'bg-blue-100',
  },
  {
    id: 20,
    name: 'News & Media',
    icon: 'article',
    description: 'Characters discussing current events, news stories, and media topics.',
    example: 'A journalist or a news anchor.',
    color: 'bg-cyan-100',
  },
  {
    id: 21,
    name: 'Miscellaneous & Others',
    icon: 'more_vert',
    description: 'Characters that don\'t fit into other categories.',
    example: 'A character with a unique background or profession.',
    color: 'bg-gray-200',
  },
].sort((a, b) => a.name.localeCompare(b.name))

// print the categories names and their desc with a example
// categories.forEach((category) => {
//   console.log(`${category.name}: ${category.description} Example: ${category.example}\n`)
// })
