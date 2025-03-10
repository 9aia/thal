import type { InternalApi } from 'nitropack'
import type { VariantProps } from 'tailwind-variants'
import type { HTMLAttributes } from 'vue'
import type { UserSelect } from '~~/db/schema'

export interface SafeProps<T extends HTMLAttributes> extends /* @vue-ignore */ T {}
export interface SafeVariantProps<T extends VariantProps> extends /* @vue-ignore */ T {}

// #region Settings

export interface Item { id: keyof UserSelect, icon: string, label: string }

// #endregion

// #region Payment

export interface PlanSettings {
  trialPeriodDays: number
  lookupKey: string
}

export type CheckoutStatus = 'open' | 'complete' | null

// #endregion

// DTOs

// #region Chat

export interface MessageData {
  type: 'text'
  value: string
}

export type MessageStatus = 'seen' | 'sent' | 'received' | 'sending' | 'error'

export interface MessageContent {
  date: Date
  text: string
  status: MessageStatus
}

export interface Character {
  id?: string
  name: string
  username: string
  avatar?: string
  discoverable?: boolean
  description?: string
}

export interface Contact {
  id?: string
  name?: string
  username: string
}

export interface Message {
  id: number
  from: 'user' | 'bot'
  message: string
  replyMessage?: string
  replyFrom?: 'user' | 'bot'
  time: number
  status: MessageStatus
  replyingId?: number | null
}

export type ChatItem = InternalApi['/api/chat']['get'][number] & {
  lastMessageStatus?: MessageStatus
}

export interface Reply {
  id: number
  message: string
  from: 'user' | 'bot'
}

export interface Replies {
  [key: string]: Reply // Username: Message
}

// #endregion
