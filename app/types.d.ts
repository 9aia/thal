import type { InternalApi } from 'nitropack'
import type { VariantProps } from 'tailwind-variants'
import type { HTMLAttributes } from 'vue'
import type { getHistory } from './server/services/messages'
import type { InReplyTo, UserSelect } from '~~/db/schema'

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

export type MessageStatus = 'seen' | 'sent' | 'received' | 'sending' | 'error'

export interface MessageContent {
  date: Date
  text: string
  status: MessageStatus
}

export type Character = InternalApi['/api/character']['default'][number]

export type Contact = InternalApi['/api/contact']['get'][number]
export type Message = Awaited<ReturnType<typeof getHistory>>['history'][number]

export type ChatItem = InternalApi['/api/chat']['get'][number] & {
  lastMessageStatus?: MessageStatus
}

export interface InReplyTos {
  [key: string]: InReplyTo
}

export type CharacterBuilderEditViewMode = 'original' | 'preview'

export type CharacterBuildApiData = InternalApi['/api/character/build']['get']

export interface CharacterShowcase {
  username: string
  name: string
  description: string
  instructions: string
  categoryName: string
}

// #endregion
