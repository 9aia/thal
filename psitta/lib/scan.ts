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
  const lines = content.split('\n')
  const messages: MessageContext[] = []

  lines.forEach((line, lineNumber) => {
    // Handle both single regex and array of regex patterns
    const regexPatterns = Array.isArray(CONFIG.messageRegex)
      ? CONFIG.messageRegex
      : [CONFIG.messageRegex]

    regexPatterns.forEach((regex) => {
      let match: RegExpExecArray | null
      // Reset regex state for each line
      regex.lastIndex = 0
      // eslint-disable-next-line no-cond-assign
      while ((match = regex.exec(line)) !== null) {
        const column = match.index + 1 // +1 to convert to 1-based index

        messages.push({
          message: match[2],
          file: filePath,
          line: lineNumber + 1, // +1 to convert to 1-based index
          column,
        })
      }
    })
  })

  return messages
}
