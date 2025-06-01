export interface CategoryConfig {
  id: number
  slug: string
  name: string
  icon: string
  description: string
  example: string
  color: string
}

const t = (x: string) => x

export const categories = ([
  {
    id: 1,
    slug: 'travel-tourism-transportation',
    name: t('Travel, Tourism & Transportation'),
    icon: 'material-symbols:flight-takeoff',
    description: 'Practice conversations for traveling abroad, including booking accommodations, asking for directions, and more.',
    example: 'A seasoned airline pilot sharing flight experiences, a friendly tour guide leading an exciting city walk, or a backpacker swapping travel stories at a hostel.',
    color: 'text-gray-500 bg-gray-50',
  },
  {
    id: 2,
    slug: 'shopping-retail',
    name: t('Shopping & Retail'),
    icon: 'material-symbols:storefront-outline',
    description: 'Characters in a retail setting, such as shopping for clothes, groceries, or electronics, designed to practice consumer interactions.',
    example: 'A helpful sales associate assisting with a purchase, a cashier at a bustling grocery store, or a tailor taking measurements for a custom suit.',
    color: 'text-orange-500 bg-gray-50',
  },
  {
    id: 3,
    slug: 'food-beverage',
    name: t('Food & Beverage'),
    icon: 'material-symbols:restaurant-menu',
    description: 'Characters for practicing conversations in restaurants, cafes, and food-related situations like menu ordering, dietary preferences, and cooking.',
    example: 'A renowned chef explaining a gourmet dish, a barista crafting a special coffee, or a diner discussing their meal preferences with a server.',
    color: 'text-gray-500 bg-gray-50',
  },
  {
    id: 4,
    slug: 'science-nature',
    name: t('Science & Nature'),
    icon: 'material-symbols:science-outline',
    description: 'Characters discussing scientific topics, nature, and environmental issues.',
    example: 'A brilliant astrophysicist explaining black holes, a dedicated conservationist advocating for wildlife, or a botanist identifying rare plants in a rainforest.',
    color: 'text-green-500 bg-gray-50',
  },
  {
    id: 5,
    slug: 'dating-relationships',
    name: t('Dating & Relationships'),
    icon: 'material-symbols:favorite-outline',
    description: 'Characters for practicing conversations related to dating, relationships, and social interactions.',
    example: 'A new acquaintance at a social gathering, a close friend offering relationship advice, or a long-term partner planning a special anniversary.',
    color: 'text-red-500 bg-gray-50',
  },
  {
    id: 6,
    slug: 'education-learning',
    name: t('Education & Learning'),
    icon: 'material-symbols:school-outline',
    description: 'Simulate discussions in educational settings, from classroom dialogues to study groups.',
    example: 'A university lecturer explaining a complex theory, a tutor guiding a student through a difficult subject, or a fellow student collaborating on a group project.',
    color: 'text-green-500 bg-gray-50',
  },
  {
    id: 7,
    slug: 'health-wellness',
    name: t('Health & Wellness'),
    icon: 'material-symbols:local-hospital-outline',
    description: 'Characters that discuss health, fitness, mental well-being, and lifestyle topics.',
    example: 'A compassionate doctor explaining a diagnosis, a personal trainer motivating a client, or a nutritionist advising on healthy eating habits.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 8,
    slug: 'technology-engineering',
    name: t('Technology & Engineering'),
    icon: 'material-symbols:memory-outline',
    description: 'Characters discussing tech trends, engineering concepts, and digital innovations.',
    example: 'A visionary software engineer pitching a new app, a roboticist explaining AI advancements, or a cybersecurity expert discussing online safety.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 9,
    slug: 'business-career',
    name: t('Business & Career'),
    icon: 'material-symbols:work-outline',
    description: 'Focused on professional settings, such as meetings, emails, and workplace interactions.',
    example: 'A marketing manager preparing for a presentation, an HR specialist conducting an interview, or a startup founder pitching an idea.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 10,
    slug: 'family-relatives',
    name: t('Family & Relatives'),
    icon: 'material-symbols:family-restroom',
    description: 'Focused on family dynamics, parenting, and relationships between relatives.',
    example: 'A grandparent sharing family stories, a teenager discussing school with their sibling, or a parent navigating challenges with their child.',
    color: 'text-red-500 bg-gray-50',
  },
  {
    id: 11,
    slug: 'law-justice',
    name: t('Law & Justice'),
    icon: 'material-symbols:gavel-rounded',
    description: 'Characters discussing legal matters, court cases, and justice-related topics.',
    example: 'A seasoned detective investigating a complex crime, a passionate human rights lawyer arguing a landmark case, or a judge presiding over a high-profile trial.',
    color: 'text-red-500 bg-gray-50',
  },
  {
    id: 12,
    slug: 'religion-spirituality',
    name: t('Religion & Spirituality'),
    icon: 'material-symbols:church-outline',
    description: 'Characters discussing religious beliefs, spiritual practices, and philosophical topics.',
    example: 'A wise monk sharing insights on mindfulness, a theologian debating ancient scriptures, or a spiritual healer guiding someone through a personal journey.',
    color: 'text-magenta-500 bg-gray-50',
  },
  {
    id: 13,
    slug: 'sports-recreation',
    name: t('Sports & recreation'),
    icon: 'material-symbols:sports-soccer',
    description: 'Characters discussing sports, fitness, and recreational activities.',
    example: 'An enthusiastic sports commentator analyzing a game, a dedicated fitness instructor guiding a workout, or an adventurous hiker sharing tales from the trail.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 14,
    slug: 'hotel-lodging',
    name: t('Hotel & Lodging'),
    icon: 'material-symbols:hotel-outline',
    description: 'Characters for practicing conversations in hotels, hostels, and other lodging situations.',
    example: 'A friendly hotel receptionist checking in guests, a knowledgeable concierge recommending local attractions, or a hostel manager greeting new travelers.',
    color: 'text-brown-500 bg-gray-50',
  },
  {
    id: 15,
    slug: 'comedy-entertainment',
    name: t('Comedy & Entertainment'),
    icon: 'material-symbols:movie-outline',
    description: 'Characters related to the entertainment industry, including actors, comedians, and performers.',
    example: 'A witty stand-up comedian preparing for a show, a famous movie star discussing their latest blockbuster, or a dynamic music producer working on a new hit album.',
    color: 'text-gray-500 bg-gray-50',
  },
  {
    id: 16,
    slug: 'real-estate',
    name: t('Real Estate'),
    icon: 'material-symbols:house-outline',
    description: 'Characters for practicing conversations in real estate, including buying, selling, or renting properties.',
    example: 'A busy real estate agent showing a dream home, a meticulous property manager handling tenant requests, or a potential homebuyer negotiating a deal.',
    color: 'text-orange-500 bg-gray-50',
  },
  {
    id: 17,
    slug: 'art-design',
    name: t('Art & Design'),
    icon: 'material-symbols:palette-outline',
    description: 'Characters related to art, design, and creative fields.',
    example: 'A passionate painter working on their masterpiece, a cutting-edge graphic designer pitching a new brand identity, or a sculptor explaining their latest exhibition.',
    color: 'text-magenta-500 bg-gray-50',
  },
  {
    id: 18,
    slug: 'casual-everyday',
    name: t('Casual & Everyday'),
    icon: 'material-symbols:chat-outline',
    description: 'Characters for casual conversations about everyday life, hobbies, and interests.',
    example: 'A friendly neighbor discussing garden tips, a fellow commuter sharing thoughts on the morning news, or a new acquaintance chatting about weekend plans.',
    color: 'text-orange-500 bg-gray-50',
  },
  {
    id: 19,
    slug: 'news-media',
    name: t('News & Media'),
    icon: 'material-symbols:article-outline',
    description: 'Characters discussing current events, news stories, and media topics.',
    example: 'A sharp journalist reporting live from the scene, a seasoned news anchor delivering the evening headlines, or a documentary filmmaker discussing their latest project.',
    color: 'text-blue-500 bg-gray-50',
  },
  {
    id: 20,
    slug: 'miscellaneous-others',
    name: t('Miscellaneous & Others'),
    icon: 'material-symbols:more-vert',
    description: 'Characters that don\'t fit into other categories.',
    example: 'A quirky antique collector sharing stories behind their finds, a futuristic inventor showcasing their latest gadget, or a volunteer organizing a community event.',
    color: 'text-gray-500 bg-gray-50',
  },
] as const satisfies CategoryConfig[])
  .sort((a, b) => a.name.localeCompare(b.name))

export type Category = (typeof categories)[number]
export type CategorySlug = Category['slug'] | ''

// print the categories names and their desc with a example
// categories.forEach((category) => {
//   console.log(`${category.name}: ${category.description} Example: ${category.example}\n`)
// })
