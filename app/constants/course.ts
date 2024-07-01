import type { Course, Section } from "../types"

export const sectionA1: Section = {
  slug: "a1",
  name: "English A1",
  description:
    "These units give you the basic grammar rules, with explanations and exercises.",
  units: [
    {
      slug: "unit-1",
      name: "Unit 1",
      levels: [
        {
          slug: "intro",
          name: "Greetings and introductions",
          type: "vocab",
          description: "Nouns are names to things, places or ideas.",
          maxLessonAmount: 3,
          maxExerciseAmount: 4,
        },
        {
          slug: "nouns",
          name: "Nouns",
          type: "concept",
          description: "Nouns are names to things, places or ideas.",
        },
        {
          slug: "plurals",
          name: "Plurals",
          type: "concept",
          description: "A plural is a form of a word that indicates there is more than one of something.",
        },
        {
          slug: "regular-plurals",
          name: "Regular plurals",
          type: "exercise",
          maxLessonAmount: 5,
          lessonAmount: 3,
        },
        {
          slug: "f-to-ves-plurals",
          name: "-f to -ves plurals",
          type: "exercise",
        },
        {
          slug: "words-that-end-with-en",
          name: "Words that end with -en",
          type: "exercise",
        },
        {
          slug: "base-plurals",
          name: "Base plurals",
          type: "exercise",
        },
        {
          slug: "common-and-proper-nouns",
          name: "Common and proper nouns",
          type: "concept",
        },
        {
          slug: "concrete-and-abstract-nouns",
          name: "Concrete and abstract nouns",
          type: "concept",
        },
        {
          slug: "mutant-plurals",
          name: "Mutant plurals",
          type: "exercise",
        },
        {
          slug: "foreign-plurals",
          name: "Foreign plurals",
          type: "exercise",
        },
        {
          slug: "origin-of-mutant-plurals",
          name: "Origin of mutant plurals",
          type: "info",
          optional: true,
        },
      ],
    },
    {
      slug: "articles",
      name: "Articles",
      levels: [
        {
          slug: "articles",
          name: "Articles",
          type: "concept",
        },
        {
          slug: "definite-article",
          name: "Definite article",
          type: "exercise",
        },
        {
          slug: "a-article",
          name: "`a` article",
          type: "exercise",
        },
        {
          slug: "an-article",
          name: "`an` article",
          type: "exercise",
        },
      ],
    },
    {
      slug: "pronouns",
      name: "Pronouns",
      levels: [
        {
          slug: "pronouns",
          name: "Pronouns",
          type: "concept",
        },
        {
          slug: "subject-pronouns",
          name: "Subject pronouns",
          type: "concept",
        },
        {
          slug: "object-pronouns",
          name: "Object pronouns",
          type: "concept",
        },
        {
          slug: "that-vs-which",
          name: "That vs which",
          type: "exercise",
        },
        {
          slug: "who-vs-whom",
          name: "Who vs whom",
          type: "exercise",
        },
        {
          slug: "possessive-adjectives",
          name: "Possessive adjectives",
          type: "concept",
        },
        {
          slug: "possessive-pronouns",
          name: "Possessive pronouns",
          type: "concept",
        },
        {
          slug: "singular-they",
          name: "Singular they",
          type: "exercise",
          optional: true,
        },
      ],
    },
  ],
}

export const sectionA2: Section = {
  slug: "a2",
  name: "English A2",
  description:
    "These units give you the basic grammar rules, with explanations and exercises.",
  units: [
    {
      slug: "unit-1",
      name: "Unit 1",
      levels: [
        {
          slug: "intro",
          name: "Greetings",
          type: "vocab",
          description: "Nouns are names to things, places or ideas.",
        },
      ],
    },
  ],
}

export const sectionB1: Section = {
  slug: "b1",
  name: "English B1",
  description:
    "These units give you the basic grammar rules, with explanations and exercises.",
  units: [
    {
      slug: "unit-1",
      name: "Unit 1",
      levels: [
        {
          slug: "intro",
          name: "Greetings",
          type: "vocab",
          description: "Nouns are names to things, places or ideas.",
        },
      ],
    },
  ],
}

export const course: Course = {
  name: "English",
  sections: [
    sectionA1,
    sectionA2,
    sectionB1,
  ],
}

export const SECTION_NAMES = ["a1", "a2", "b1", "b2", "c1", "c2"] as const

export type SectionName = typeof SECTION_NAMES[number]
