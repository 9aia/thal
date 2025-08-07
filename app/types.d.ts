import type { InternalApi } from 'nitropack'
import type { VariantProps } from 'tailwind-variants'
import type { HTMLAttributes } from 'vue'
import type { getHistory } from './server/services/messages'
import type { InReplyTo, UserSelect } from '~~/db/schema'

export interface SafeProps<T extends HTMLAttributes> extends /* @vue-ignore */ T {}
export interface SafeVariantProps<T extends VariantProps> extends /* @vue-ignore */ T {}

// #region Release

export type Release = 'preview' | 'early-access' | 'early-stable' | 'stable' | 'dev'

// #endregion

// #region Sidebar

export interface SidebarStore {
  open: Ref<boolean>
  ROOT_STATE: SidebarState
  COMPONENT_KEYS: string[]
  history: Ref<SidebarFullPath[]>
  state: ComputedRef<SidebarState>
  view: ComputedRef<string>
  param: ComputedRef<string | undefined>
  navigationDirection: Ref<'forward' | 'backward'>
  animate: Ref<boolean>
}

export interface SidebarState<T extends SidebarView = SidebarView> {
  view: T
  param?: string
}

export interface SidebarNavigateOptions {
  param?: string
  autoRedirect?: boolean
  open?: boolean
}

export type SidebarView = string
export type SidebarPathWithParam<T extends SidebarView = SidebarView> = `${SidebarView<T>}=${string}`
export type SidebarFullPath<T extends SidebarView = SidebarView> = SidebarView<T> | SidebarPathWithParam<T>

// #endregion

// #region Settings

export interface Item { id: keyof UserSelect, icon: string, label: string }

// #endregion

// #region Payment
export interface PlanSettings {
  trialPeriodDays: number
  priceLookupKey: string
}

export type CheckoutStatus = 'open' | 'complete' | null

// #endregion

// #region Character

export type Character = InternalApi['/api/character']['default'][number]

// #endregion

// #region CharacterBuilder

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

// #region Contact

export type Contact = InternalApi['/api/contact']['get'][number]

// #endregion

// #region Chat

export type Chats = InternalApi['/api/chat']['get']
export type ChatItem = InternalApi['/api/chat']['get'][number]

// #endregion

// #region Message

export type Message = Awaited<ReturnType<typeof getHistory>>[number]

export interface InReplyTos {
  [key: string]: InReplyTo
}

export interface MessageSend {
  id?: number // When it's editing, it's the message id and it means retrying
  content: string
  time: number
  inReplyTo?: InReplyTo
}

export interface MessageCorrectionData extends MessageCorrection {
  status: 'ok' | 'needs_correction'
}

export interface MessageCorrection {
  severity?: 'minor' | 'moderate' | 'major' | null
  correctedMessage?: string | null
}

// #endregion

// #region History

export type History = Awaited<ReturnType<typeof getHistory>>

// #endregion
