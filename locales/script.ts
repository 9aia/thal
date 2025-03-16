import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import fg from 'fast-glob'
import { type Locale, type Message, type Text, type Translations, getConfig } from '@psitta/core'
import { type ResponseSchema, SchemaType } from '@google/generative-ai'
import { getGemini } from '~/utils/gemini'

const CONFIG = {
  // content: ['./app/**/*.vue'],
  content: ['./app/**/*.vue', './app/composables/*.ts', './app/constants/*.ts'],
  messageRegex: /\bt\s*\(\s*(["'`])(.*?)\1\s*[,)]/g,
  // messageRegex: /(?<=[a-zA-Z0-9])t\(['"]([^'"]+)['"]\)/g,
  messagePerChunk: 10,
}

interface MessageContext {
  message: string
  file: string
  line: number
  column: number
}

const cache = new Set<string>()

const messages: Chunk = {}

async function loadCache() {
  const messages = await import('./index.js')

  Object.values(messages).forEach((translations) => {
    Object.keys(translations).forEach((message) => {
      cache.add(message)
    })
  })
}

async function loadTranslations() {
  const messagesFileContent = (await import('./index.js')).default

  Object.entries(messagesFileContent).forEach(([message, translations]) => {
    Object.entries(translations).forEach(([lang, translationChunk]) => {
      if (!messages?.[message]) {
        messages[message] = {}
      }

      messages[message][lang] = translationChunk
    })
  })
}

function saveTranslations() {
  const content = `/* eslint-disable */ export default ${JSON.stringify(messages, null, 2)}`

  writeFileSync(`./locales/index.js`, content)
}

function readMessages(filePath: string): MessageContext[] {
  const content = readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const messages: MessageContext[] = []

  lines.forEach((line, lineNumber) => {
    let match: RegExpExecArray | null
    // eslint-disable-next-line no-cond-assign
    while ((match = CONFIG.messageRegex.exec(line)) !== null) {
      const column = match.index + 1 // +1 to convert to 1-based index
      messages.push({
        message: match[2],
        file: filePath,
        line: lineNumber + 1, // +1 to convert to 1-based index
        column,
      })
    }
  })

  return messages
}

async function extractMessagesFromFiles(source: string): Promise<MessageContext[]> {
  const files = await fg(source)
  const allMessages = new Set<MessageContext>()

  files.forEach((file) => {
    const messages = readMessages(file)
    messages.forEach(msg => allMessages.add(msg))
  })

  return Array.from(allMessages)
}

type Chunk = Record<Message, Translations>

async function main() {
  await loadCache()
  await loadTranslations()

  const extractedMessages = (await extractMessagesFromFiles(CONFIG.content as any)).filter(msg => !cache.has(msg.message))

  const chunks = Array.from(extractedMessages).reduce((acc, msg, index) => {
    const chunkIndex = Math.floor(index / CONFIG.messagePerChunk)
    const chunk = acc[chunkIndex] || {}
    chunk[msg.message] = {}
    acc[chunkIndex] = chunk
    return acc
  }, [] as Chunk[])

  for (const chunk of chunks) {
    if (Object.keys(chunk).length === 0) {
      continue
    }

    await translate(chunk)
  }

  saveTranslations()
}

async function translate(chunk: Chunk) {
  const { GEMINI_API_KEY, GEMINI_MODEL } = process.env

  if (!GEMINI_API_KEY)
    throw new Error('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw new Error('GEMINI_MODEL is not set in the environment')

  const gemini = getGemini(GEMINI_API_KEY as string)

  const systemInstructions = `
    You are a translator. You are expected to translate the following messages from English to Brazilian Portuguese.

    If you encounter any variables, please keep them in the translation.
  `
  const prompt = Object.keys(chunk).toString()

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

  const res = await gemini.generateContent(prompt, GEMINI_MODEL, systemInstructions, {
    responseMimeType: 'application/json',
    responseSchema,
  })

  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text = bestPart?.text

  type GeminiTranslations = Array<Record<Locale, Text>>
  type PsittaTranslations = Record<Text, Record<Locale, Text>>

  const geminiTranlations: GeminiTranslations = JSON.parse(text)
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

main().catch(console.error)
