import process from 'node:process'
import { type ResponseSchema, SchemaType } from '@google/generative-ai'
import { getConfig } from '@psitta/core'
import type { Locale, Text } from '@psitta/core'
import { cache } from './cache'
import type { Chunk } from './types'
import { messages } from './messages'
import { promptGeminiJson } from '~~/app/utils/gemini'

export async function translate(chunk: Chunk) {
  const { GEMINI_API_KEY, GEMINI_MODEL } = process.env

  if (!GEMINI_API_KEY)
    throw new Error('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw new Error('GEMINI_MODEL is not set in the environment')

  const systemInstruction = `
    You are a translator. You are expected to translate the following messages from English to Brazilian Portuguese.

    If you encounter any variables, please keep them in the translation.
  `
  const prompt = Object.entries(chunk).map(([key, value]) => JSON.stringify({ en: key, pt: value.pt })).join('\n')

  const responseSchema: ResponseSchema = {
    type: SchemaType.ARRAY,
    description: 'A collection of messages and their translations.',
    nullable: false,
    items: {
      type: SchemaType.OBJECT,
      description: 'A message and its translations.',
      properties: {
        en: {
          type: SchemaType.STRING,
          description: 'The original message in English.',
          nullable: false,
        },
        pt: {
          type: SchemaType.STRING,
          description: 'The translation of the message in Portuguese.',
          nullable: false,
        },
      },
    },
  }

  const geminiTranlations = await promptGeminiJson<GeminiTranslations>({
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    prompt,
    systemInstruction,
    responseSchema,
  })

  type GeminiTranslations = Array<Record<Locale, Text>>
  type PsittaTranslations = Record<Text, Record<Locale, Text>>

  const defaultLocale = getConfig().defaultLocale

  const normalizedJson = geminiTranlations.reduce((acc, cur) => {
    const { [defaultLocale]: defaultText, ...translations } = cur
    acc[defaultText] = translations
    return acc
  }, {} as PsittaTranslations)

  for (const [message, translations] of Object.entries(normalizedJson)) {
    cache.add(message)

    for (const [lang, _translation] of Object.entries(translations as any)) {
      if (!messages?.[message]) {
        messages[message] = {}
      }

      (messages as any)[message][lang] = _translation
    }
  }
}

export async function adjust(chunk: Chunk, prompt: string) {
  const { GEMINI_API_KEY, GEMINI_MODEL } = process.env

  if (!GEMINI_API_KEY)
    throw new Error('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw new Error('GEMINI_MODEL is not set in the environment')

  const systemInstruction = `
    You are a translation editor. You will receive existing translations and a prompt describing how to adjust them.
    
    Your task is to modify the existing translations according to the provided prompt while maintaining the same meaning and structure.
    
    - If you encounter any variables (like {variable}), please keep them exactly as they are in the adjusted translations.
    - Don't change links.
    - Only adjust the pt translations.

    --- Prompt ---
    ${prompt}
  `

  const responseSchema: ResponseSchema = {
    type: SchemaType.ARRAY,
    description: 'A collection of messages and their adjusted translations.',
    nullable: false,
    items: {
      type: SchemaType.OBJECT,
      description: 'A original translation and its adjusted translation.',
      properties: {
        en: {
          type: SchemaType.STRING,
          description: 'The original message (should remain unchanged).',
          nullable: false,
        },
        pt: {
          type: SchemaType.STRING,
          description: 'The adjusted translation.',
          nullable: false,
        },
      },
    },
  }

  const promptText = Object.entries(chunk).map(([key, value]) => JSON.stringify({ en: key, pt: value.pt })).join('\n')

  const geminiAdjustments = await promptGeminiJson<GeminiTranslations>({
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    prompt: `${promptText}`,
    systemInstruction,
    responseSchema,
  })

  type GeminiTranslations = Array<Record<Locale, Text>>
  type PsittaTranslations = Record<Text, Record<Locale, Text>>

  const defaultLocale = getConfig().defaultLocale

  const normalizedJson = geminiAdjustments.reduce((acc, cur) => {
    const { [defaultLocale]: defaultText, ...translations } = cur
    acc[defaultText] = translations
    return acc
  }, {} as PsittaTranslations)

  for (const [message, translations] of Object.entries(normalizedJson)) {
    for (const [lang, _translation] of Object.entries(translations as any)) {
      if (!messages?.[message]) {
        messages[message] = {}
      }

      (messages as any)[message][lang] = _translation
    }
  }
}
