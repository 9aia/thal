import type { Section, Course } from './types'

export const sectionA1: Section = {
  id: 'a1',
  name: 'English A1',
  description:
    'These units give you the basic grammar rules, with explanations and exercises.',
  units: [
    {
      id: 'unit-1',
      name: 'Unit 1',
      nodes: [
        {
          name: 'Greetings and introductions',
          type: 'vocab',
          description: 'Nouns are names to things, places or ideas.',
        },
        {
          name: 'Nouns',
          type: 'concept',
          description: 'Nouns are names to things, places or ideas.',
        },
        {
          name: 'Plurals',
          type: 'concept',
          description: 'A plural is a form of a word that indicates there is more than one of something.',
        },
        {
          name: 'Regular plurals',
          type: 'exercise',
          maxLevel: 5,
          level: 1,
        },
        {
          name: '-f to -ves plurals',
          type: 'exercise',
        },
        {
          name: 'Words that end with -en',
          type: 'exercise',
        },
        {
          name: 'Base plurals',
          type: 'exercise',
        },
        {
          name: 'Common and proper nouns',
          type: 'concept',
        },
        {
          name: 'Concrete and abstract nouns',
          type: 'concept',
        },
        {
          name: 'Mutant plurals',
          type: 'exercise',
        },
        {
          name: 'Foreign plurals',
          type: 'exercise',
        },
        {
          name: 'Origin of mutant plurals',
          type: 'info',
          optional: true,
        },
      ],
    },
    {
      id: 'articles',
      name: 'Articles',
      nodes: [
        {
          name: 'Articles',
          type: 'concept',
        },
        {
          name: 'Definite article',
          type: 'exercise',
        },
        {
          name: '`a` article',
          type: 'exercise',
        },
        {
          name: '`an` article',
          type: 'exercise',
        },
      ],
    },
    {
      id: 'pronouns',
      name: 'Pronouns',
      nodes: [
        {
          name: 'Pronouns',
          type: 'concept',
        },
        {
          name: 'Subject pronouns',
          type: 'concept',
        },
        {
          name: 'Object pronouns',
          type: 'concept',
        },
        {
          name: 'That vs which',
          type: 'exercise',
        },
        {
          name: 'Who vs whom',
          type: 'exercise',
        },
        {
          name: 'Possessive adjectives',
          type: 'concept',
        },
        {
          name: 'Possessive pronouns',
          type: 'concept',
        },
        {
          name: 'Singular they',
          type: 'exercise',
          optional: true,
        },
      ],
    },
  ],
}

export const sectionA2: Section = {
  id: 'a2',
  name: 'English A2',
  description:
    'These units give you the basic grammar rules, with explanations and exercises.',
  units: [
    {
      id: 'unit-1',
      name: 'Unit 1',
      nodes: [
        {
          name: 'Greetings',
          type: 'vocab',
          description: 'Nouns are names to things, places or ideas.',
        },
      ],
    },
  ]
}

export const sectionB1: Section = {
  id: 'b1',
  name: 'English B1',
  description:
    'These units give you the basic grammar rules, with explanations and exercises.',
  units: [
    {
      id: 'unit-1',
      name: 'Unit 1',
      nodes: [
        {
          name: 'Greetings',
          type: 'vocab',
          description: 'Nouns are names to things, places or ideas.',
        },
      ],
    },
  ]
}

export const course: Course = {
  name: 'English',
  sections: [
    sectionA1,
    sectionA2,
    sectionB1,
  ]
}
