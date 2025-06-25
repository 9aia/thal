import { writeFileSync } from 'node:fs'
import process from 'node:process'
import { CONFIG } from '../config'
import type { Chunk } from './types'

export const messages: Chunk = {}

export async function loadTranslations() {
  const messagesFileContent = (await import(`${process.cwd()}/${CONFIG.localesFolder}/index.js`)).default

  Object.entries(messagesFileContent).forEach(([message, translations]) => {
    Object.entries(translations as any).forEach(([lang, translationChunk]) => {
      if (!messages?.[message]) {
        messages[message] = {}
      }

      (messages as any)[message][lang] = translationChunk
    })
  })
}

export function saveTranslations() {
  const content = `/* eslint-disable */ export default ${JSON.stringify(messages, null, 2)}`

  writeFileSync(`${CONFIG.localesFolder}/index.js`, content)
}
