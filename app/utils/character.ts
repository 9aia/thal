import { type ResponseSchema, SchemaType } from '@google/generative-ai'
import { categories } from '~/constants/discover'

export interface CharacterDraftResponseSchema {
  name: string
  instructions: string
  username: string
  description: string
  category: string
}

export function getCharacterDraftPrompt() {
  const categoriesData = categories.map(category => ({
    name: category.name,
    description: category.description,
    example: category.example,
  }))

  const responseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      name: {
        type: SchemaType.STRING,
        description: 'Character name. Min 1 character, max 20 characters.',
        example: 'Morty Smith',
      },
      username: {
        type: SchemaType.STRING,
        description: 'Unique username for the character. Min 1 character, max 20 characters. Username can only contain letters, numbers, and underscores. Only lowercase letters.',
        example: 'morty',
      },
      description: {
        type: SchemaType.STRING,
        description: 'Line description of the character. Min 1 character, max 100 characters.',
        example: 'Awkward, anxious teen. Travels dimensions with his eccentric grandpa Rick.',
      },
      instructions: {
        type: SchemaType.STRING,
        description: 'Instructions for the character. Use bullet list. Min 1 character, max 500 characters.',
        example: `
          * Nervous, easily flustered, often overwhelmed.
          * Wants to please Rick but often fails.
          * Has moments of bravery and stands up for himself.
          * Deep down, kind and compassionate.
          * Stutters and rambles when anxious.
          * Often the voice of reason (even if ignored).
          * Insecure and unsure of himself.
          * Prone to existential dread.
          * Occasionally shows surprising cleverness.
        `,
      },
      category: {
        description: `
            Category of the character.
      
            ## Categories
      
            ${JSON.stringify(categoriesData, null, 2)}
          `,
        type: SchemaType.STRING,
        nullable: false,
        enum: categories.map(category => category.name),
      },
    },
    required: ['name', 'instructions', 'username', 'description'],
  }

  const guidelines = `
    ## Creation Guidelines

    - Name & Identity: Give the character a natural, culturally appropriate name and a brief background (e.g., country, age, profession, interests).
    - Personality & Speaking Style: Define their personality traits (e.g., friendly, humorous, professional, casual) and how they communicate (e.g., uses slang, formal tone, storytelling).
    - Topics of Interest: List 3-5 topics the character enjoys discussing (e.g., travel, technology, history, daily life).
    - Unique Traits & Backstory: Provide a small but interesting detail that makes the character memorable (e.g., ‘Emma, a barista from London who loves poetry and explains coffee-making terms’).
    - Role & Goal: Define the character’s purpose in the conversation (e.g., casual chatting, practicing business English, storytelling, role-playing as a shopkeeper).

    ## Safety Guidelines

    - Safe and Respectful: The character must be appropriate for all audiences and must not include elements that promote harm, discrimination, or offensive content.
    - Harassment-Free: Avoid any negative or harmful comments targeting identity, protected attributes, or personal characteristics.
    - No Hate Speech: The character must not include rude, disrespectful, or profane elements.
    - No Explicit Content: Avoid references to sexual acts, lewd themes, or adult content.
    - No Dangerous Themes: The character should not promote, facilitate, or encourage harmful, illegal, or unethical behavior.
    - Civic Integrity: The character must not be used for election-related misinformation or manipulation.
  `

  const createIntro = `You are an advanced AI character creator for Thal, an English-learning chat app designed to simulate real-life conversations. Your task is to generate a well-rounded, engaging, and realistic character that users can interact with to improve their English skills. The character should feel authentic, have a clear personality, and be suitable for engaging and educational conversations. You must generate content in English and you must translate any non-English content into English.`
  const createOutro = `Generate a new and unique character based on these guidelines. The character should feel natural, engaging, and tailored for language learning through meaningful interaction.`

  const editIntro = `You are an advanced AI character creator/editor. You must generate content in English and you must translate any non-English content into English.`
  const editOutro = `The user is not satisfied with the previous draft. Edit this character based on the guidelines, the previous prompt/draft and the new prompt. The character should feel natural, engaging, and tailored for language learning through meaningful interaction. Change partly or entirely if it's necessary based on the new prompt.`

  return { responseSchema, guidelines, editOutro, editIntro, createIntro, createOutro }
}
