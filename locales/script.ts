import { readFileSync, writeFileSync } from 'node:fs'
import process from 'node:process'
import fg from 'fast-glob'
import type { Message, Translations } from '@psitta/core'
import { getGemini } from '~/utils/gemini'

const CONFIG = {
  // content: ['./app/**/*.vue'],
  content: ['./app/**/*.vue'],
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

  console.log({ messages, cache })

  console.log('loaded in to ram')

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
  const { GEMINI_API_KEY } = process.env

  const prompt = `
    Translate the following Object:

    ${JSON.stringify(chunk, null, 2)}.

    Use this example as a guide:

    {
      "About me": {
        "pt": "Sobre mim"
      },
      "Edit interests": {
        "pt": "Editar interesses"
      },
      "Interests": {
        "pt": "Interesses"
      },
      "Pick up to 7 interests or sports you enjoy that you want to AI know about you.": {
        "pt": "Escolha de 7 a 7 interessses ou esportes que você gosta, que você quer que a AI saiba sobre você"
      },
      "Save": {
        "pt": "Salvar"
      },
      "Test": {
        "pt": "Teste"
      },
      "You have {count} (apple|apples)": {
        "pt": "Você possui {count} (maçã|maçãs)"
      },
      "Logout": {
        "pt": "Sair"
      },
      "You have {n} (apple|apples) and {m} (box|boxes)": {
        "pt": "Você possui {n} (apple|apples) e {m} (box|boxes)"
      }
    }

    If you encounter any variables, please keep them in the translation.
  `

  const gemini = getGemini(GEMINI_API_KEY as string)

  const res = await gemini.generateContent(prompt, undefined, {
    responseMimeType: 'application/json',
  })

  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text = bestPart?.text

  const json = JSON.parse(text)

  console.log(json)

  for (const [message, translations] of Object.entries(json)) {
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
