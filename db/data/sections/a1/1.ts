import type { Unit } from "~/types"

export default [
  {
    id: "unit-1",
    name: "Unit 1",
    levels: [
      {
        id: "intro",
        name: "Greetings and introductions",
        type: "vocab",
        description: "Nouns are names to things, places or ideas.",
      },
      {
        id: "nouns",
        name: "Nouns",
        type: "concept",
        description: "Nouns are names to things, places or ideas.",
      },
      {
        id: "plurals",
        name: "Plurals",
        type: "concept",
        description: "A plural is a form of a word that indicates there is more than one of something.",
      },
      {
        id: "regular-plurals",
        name: "Regular plurals",
        type: "exercise",
        maxLevel: 5,
        level: 1,
      },
      {
        id: "f-to-ves-plurals",
        name: "-f to -ves plurals",
        type: "exercise",
      },
      {
        id: "words-that-end-with-en",
        name: "Words that end with -en",
        type: "exercise",
      },
      {
        id: "base-plurals",
        name: "Base plurals",
        type: "exercise",
      },
      {
        id: "common-and-proper-nouns",
        name: "Common and proper nouns",
        type: "concept",
      },
      {
        id: "concrete-and-abstract-nouns",
        name: "Concrete and abstract nouns",
        type: "concept",
      },
      {
        id: "mutant-plurals",
        name: "Mutant plurals",
        type: "exercise",
      },
      {
        id: "foreign-plurals",
        name: "Foreign plurals",
        type: "exercise",
      },
      {
        id: "origin-of-mutant-plurals",
        name: "Origin of mutant plurals",
        type: "info",
        optional: true,
      },
    ],
  },
  {
    id: "articles",
    name: "Articles",
    levels: [
      {
        id: "articles",
        name: "Articles",
        type: "concept",
      },
      {
        id: "definite-article",
        name: "Definite article",
        type: "exercise",
      },
      {
        id: "a-article",
        name: "`a` article",
        type: "exercise",
      },
      {
        id: "an-article",
        name: "`an` article",
        type: "exercise",
      },
    ],
  },
  {
    id: "pronouns",
    name: "Pronouns",
    levels: [
      {
        id: "pronouns",
        name: "Pronouns",
        type: "concept",
      },
      {
        id: "subject-pronouns",
        name: "Subject pronouns",
        type: "concept",
      },
      {
        id: "object-pronouns",
        name: "Object pronouns",
        type: "concept",
      },
      {
        id: "that-vs-which",
        name: "That vs which",
        type: "exercise",
      },
      {
        id: "who-vs-whom",
        name: "Who vs whom",
        type: "exercise",
      },
      {
        id: "possessive-adjectives",
        name: "Possessive adjectives",
        type: "concept",
      },
      {
        id: "possessive-pronouns",
        name: "Possessive pronouns",
        type: "concept",
      },
      {
        id: "singular-they",
        name: "Singular they",
        type: "exercise",
        optional: true,
      },
    ],
  },
] satisfies Unit[]
