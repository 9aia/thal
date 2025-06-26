import { readFileSync } from 'node:fs'
import fg from 'fast-glob'
import { CONFIG } from '../config'

import type { MessageContext } from './types'

export async function extractMessagesFromFiles(source: string): Promise<MessageContext[]> {
  const files = await fg(source)
  const allMessages = new Set<MessageContext>()

  files.forEach((file: any) => {
    const messages = readMessages(file)
    messages.forEach(msg => allMessages.add(msg))
  })

  return Array.from(allMessages)
}

export function readMessages(filePath: string): MessageContext[] {
  const content = readFileSync(filePath, 'utf8')
  const messages: MessageContext[] = []

  // Handle both single regex and array of regex patterns
  const regexPatterns = Array.isArray(CONFIG.messageRegex)
    ? CONFIG.messageRegex
    : [CONFIG.messageRegex]

  regexPatterns.forEach((regex) => {
    let match: RegExpExecArray | null

    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(content)) !== null) {
      const lineNumber = content.slice(0, match.index).split('\n').length
      const column = match.index + 1 // +1 to convert to 1-based index

      if (filePath.includes('AccountSettingsForm.vue')) {
        console.log({
          message: match[2],
          file: filePath,
          line: lineNumber,
          column,
        })
      }

      messages.push({
        message: match[2],
        file: filePath,
        line: lineNumber,
        column,
      })
    }
  })

  return messages
}
