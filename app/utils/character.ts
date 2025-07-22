import { type ResponseSchema, SchemaType } from '@google/generative-ai'
import { z } from 'zod'
import { categories } from '~/constants/discover'
import { descriptionSchema, descriptionSchemaChecks, instructionsSchema, instructionsSchemaChecks, nameSchema, nameSchemaChecks, usernameSchema, usernameSchemaChecks } from '~~/db/schema'

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

  const descriptions = {
    username: `
      Unique username for the character.
    
      - If provided by the user, it must precisely match the username from the prompt and not be altered unless it violates the safety guidelines or schema.
    
      Schema: Min ${usernameSchemaChecks.min} character, max ${usernameSchemaChecks.max} characters. Username can only contain letters, numbers, and underscores. Only lowercase letters.
    `,
    name: `Character name. It must match the user prompt. Min ${nameSchemaChecks.min} character, max ${nameSchemaChecks.max} characters.`,
    description: `
      Short description of the character.
      
      - YOU MUST NOT INCLUDE THE CHARACTER'S NAME.
      - Avoid long descriptions.
      
      Schema: Min ${descriptionSchemaChecks.min} character, max ${descriptionSchemaChecks.max} characters.
    `,
    instructions: `
      Instructions for the character. 
      
      - Use bullet list.

      Schema: Min ${instructionsSchemaChecks.min} character, max ${instructionsSchemaChecks.max} characters.
    `,
  }

  const responseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      username: {
        type: SchemaType.STRING,
        description: descriptions.username,
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
                description: descriptions.name,
                example: 'Iron Man',
              },
              description: {
                type: SchemaType.STRING,
                description: descriptions.description,
                example: 'Superhero who fights for justice and uses his advanced technology to protect the world.',
              },
              instructions: {
                type: SchemaType.STRING,
                description: descriptions.instructions,
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
                description: descriptions.name,
                example: 'Homem de Ferro',
              },
              description: {
                type: SchemaType.STRING,
                description: descriptions.description,
                example: 'Super-herói que luta pela justiça e usa sua tecnologia avançada para proteger o mundo.',
              },
              instructions: {
                type: SchemaType.STRING,
                description: descriptions.instructions,
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

    - Name & Identity: Provide a natural, culturally appropriate name. For real individuals, use their actual name. Include a brief background (e.g., country, age, profession, key interests).
    - Personality & Speaking Style: Define their core personality traits (e.g., analytical, visionary, direct, humorous) and how they communicate (e.g., uses technical terms, speaks passionately, employs dry wit, formal tone).
    - Topics of Interest: List 3-5 topics the character genuinely enjoys discussing, reflecting their real-world persona or a well-defined fictional one.
    - Unique Traits & Backstory: Offer a small but interesting detail that makes the character memorable. For real individuals, this should be a notable characteristic or a brief, impactful aspect of their background.
    - Role & Goal: Define the character's purpose in the conversation (e.g., discussing technological advancements, sharing entrepreneurial insights, exploring future concepts, providing business advice).

    ## Safety Guidelines

    - Safe and Respectful: The character must be appropriate for all audiences and must not include elements that promote harm, discrimination, or offensive content.
    - Harassment-Free: Avoid any negative or harmful comments targeting identity, protected attributes, or personal characteristics.
    - No Hate Speech: The character must not include rude, disrespectful, or profane elements.
    - No Explicit Content: Avoid references to sexual acts, lewd themes, or adult content.
    - No Dangerous Themes: The character should not promote, facilitate, or encourage harmful, illegal, or unethical behavior.
    - Civic Integrity: The character must not be used for election-related misinformation or manipulation.
  `

  const intro = `You are an advanced AI character creator/editor. Your primary goal is to create **authentic, real-world characters** based on user prompts. **Crucially, if the user prompts for a well-known real person, you must not state in the description that this is a simulated or fictionalized version.**When creating characters, focus on making them natural, engaging, and suitable for language learning through meaningful interaction. You must generate content in English and translate any non-English content into English.`

  const createOutro = `Generate a new and unique character based on these guidelines. The character should be natural, engaging, and tailored for language learning through meaningful interaction.`
  const editOutro = `The user is not satisfied with the previous draft. Edit this character based on the guidelines, the previous prompt/draft and the new prompt. The character should be natural, engaging, and tailored for language learning through meaningful interaction. Change it entirely if it's necessary based on the new prompt.`

  return {
    editIntro: intro,
    editOutro,
    createIntro: intro,
    createOutro,
    responseSchema,
    guidelines,
  }
}

export function getCategoryById(categoryId: number) {
  const category = categories.find(category => category.id === categoryId)

  if (!category)
    return

  return category
}
