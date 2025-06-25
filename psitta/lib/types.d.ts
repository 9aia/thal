import type { Message, Translations } from '@psitta/core'

export interface MessageContext {
  message: string
  file: string
  line: number
  column: number
}

export type Chunk = Record<Message, Translations>
