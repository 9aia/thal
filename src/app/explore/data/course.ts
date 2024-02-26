import type { Section } from '../types.d'

export const sectionA1: Section = {
  name: 'English A1',
  description:
    'These units give you the basic grammar rules, with explanations and exercises.',
  units: [
    {
      id: 'unit-1',
      name: 'Basics of Nouns',
      nodes: [
        {
          name: 'Plurals',
          type: 'concept',
          description: 'Nouns are names to things, places or ideas.',
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
