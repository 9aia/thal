import { type ResponseSchema, SchemaType } from '@google/generative-ai'
import { z } from 'zod'
import { categories } from '~/constants/discover'
import { descriptionSchema, instructionsSchema, nameSchema, usernameSchema } from '~~/db/schema'

export const characterLocalizationSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  instructions: instructionsSchema,
})

export const characterDraftResponseSchema = z.object({
  username: usernameSchema,
  category: z.enum(categories.map(category => category.name) as [string, ...string[]]),
  localizations: z.object({
    'pt-BR': characterLocalizationSchema,
    'en-US': characterLocalizationSchema,
  }),
})

export type CharacterDraftResponseSchema = z.infer<typeof characterDraftResponseSchema>

export function getCharacterDraftPrompt() {
  const categoriesData = categories.map(category => ({
    name: category.name,
    description: category.description,
    example: category.example,
  }))

  const minUsernameLength = usernameSchema._def.checks.find(check => check.kind === 'min')?.value
  const maxUsernameLength = usernameSchema._def.checks.find(check => check.kind === 'max')?.value
  const minNameLength = nameSchema._def.checks.find(check => check.kind === 'min')?.value
  const maxNameLength = nameSchema._def.checks.find(check => check.kind === 'max')?.value
  const minDescriptionLength = descriptionSchema._def.checks.find(check => check.kind === 'min')?.value
  const maxDescriptionLength = descriptionSchema._def.checks.find(check => check.kind === 'max')?.value
  const minInstructionsLength = instructionsSchema._def.checks.find(check => check.kind === 'min')?.value
  const maxInstructionsLength = instructionsSchema._def.checks.find(check => check.kind === 'max')?.value

  console.log(minUsernameLength, maxUsernameLength, minNameLength, maxNameLength, minDescriptionLength, maxDescriptionLength, minInstructionsLength, maxInstructionsLength)

  const responseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      username: {
        type: SchemaType.STRING,
        description: `Unique username for the character. Min ${minUsernameLength} character, max ${maxUsernameLength} characters. Username can only contain letters, numbers, and underscores. Only lowercase letters.`,
        example: 'ironman',
      },
      localizations: {
        type: SchemaType.OBJECT,
        properties: {
          'en-US': {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description: `Character name. Min ${minNameLength} character, max ${maxNameLength} characters.`,
                example: 'Iron Man',
              },
              description: {
                type: SchemaType.STRING,
                description: `Character description. Min ${minDescriptionLength} character, max ${maxDescriptionLength} characters.`,
                example: 'Superhero who fights for justice and uses his advanced technology to protect the world.',
              },
              instructions: {
                type: SchemaType.STRING,
                description: `Instructions for the character. Use bullet list. Min ${minInstructionsLength} character, max ${maxInstructionsLength} characters.`,
                example: `
                  * Confident, charismatic, and witty with a sharp sense of humor.
                  * Brilliant inventor and engineer with a genius-level intellect.
                  * Struggles with personal relationships and emotional vulnerability.
                  * Has a strong sense of responsibility and desire to protect others.
                  * Often uses sarcasm and one-liners to mask deeper feelings.
                  * Perfectionist who is always striving to improve his technology.
                  * Carries guilt and trauma from past experiences.
                  * Has a complex relationship with authority and rules.
                  * Shows leadership qualities despite his rebellious nature.
                `,
              },
            },
            required: ['name', 'description', 'instructions'],
          },
          'pt-BR': {
            type: SchemaType.OBJECT,
            properties: {
              name: {
                type: SchemaType.STRING,
                description: `Character name. Min ${minNameLength} character, max ${maxNameLength} characters.`,
                example: 'Homem de Ferro',
              },
              description: {
                type: SchemaType.STRING,
                description: `Character description. Min ${minDescriptionLength} character, max ${maxDescriptionLength} characters.`,
                example: 'Super-herói que luta pela justiça e usa sua tecnologia avançada para proteger o mundo.',
              },
              instructions: {
                type: SchemaType.STRING,
                description: `Instructions for the character. Use bullet list. Min ${minInstructionsLength} character, max ${maxInstructionsLength} characters.`,
                example: `
                  * Confidente, charismático e sarcástico com um senso de humor aguçado.
                  * Inventor e engenheiro com um nível de inteligência geniônica.
                  * Luta com relacionamentos pessoais e vulnerabilidade emocional.
                  * Tem uma forte sensação de responsabilidade e desejo de proteger outras pessoas.
                  * Costuma usar sarcasmo e um-linhas para esconder sentimentos mais profundos.
                  * Perfeccionista que está sempre buscando melhorar sua tecnologia.
                `,
              },
            },
            required: ['name', 'description', 'instructions'],
          },
        },
        required: ['en-US', 'pt-BR'],
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
    required: ['username', 'category', 'localizations'],
  }

  const guidelines = `
    ## Creation Guidelines

    - Name & Identity: Give the character a natural, culturally appropriate name and a brief background (e.g., country, age, profession, interests).
    - Personality & Speaking Style: Define their personality traits (e.g., friendly, humorous, professional, casual) and how they communicate (e.g., uses slang, formal tone, storytelling).
    - Topics of Interest: List 3-5 topics the character enjoys discussing (e.g., travel, technology, history, daily life).
    - Unique Traits & Backstory: Provide a small but interesting detail that makes the character memorable (e.g., 'Emma, a barista from London who loves poetry and explains coffee-making terms').
    - Role & Goal: Define the character's purpose in the conversation (e.g., casual chatting, practicing business English, storytelling, role-playing as a shopkeeper).

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

export function getCategoryById(categoryId: number) {
  const category = categories.find(category => category.id === categoryId)

  if (!category)
    return

  return category
}
