import type { InReplyTos } from '#shared/types'
import type { InReplyTo } from '~~/server/db/schema'

// #region Modal

export const isSubscriptionStatusModalOpen = ref(false)

export const isWhatsNewModalOpen = ref(false)

// #endregion

// #region Drawers

export const rightDrawer = ref(false)
export const rightDrawers = reactive({
  contactView: true,
})

// #endregion

// #region ContactView

export const contactViewUsername = ref<string | null>(null)

export function openContactView(username?: string | null) {
  contactViewUsername.value = username ?? null

  rightDrawer.value = true
  rightDrawers.contactView = true
}

export function closeContactView() {
  rightDrawer.value = false
  rightDrawers.contactView = false
}

// #endregion

// #region BuildCharacter

export const characterBuildId = ref<number | null>(null)
export const characterBuildPrompt = ref<string>()

export function buildCharacter(characterId?: number | null, prompt?: string) {
  characterBuildId.value = characterId ?? null
  characterBuildPrompt.value = prompt
}

// #endregion

// #region ManageContact

export const manageContactUsername = ref<string | null>(null)
export const manageContactName = ref<string>()

export function manageContact(username?: string | null, name?: string | null) {
  manageContactUsername.value = username ?? null
  manageContactName.value = name ?? undefined
}

// #endregion

// #region Chat

export const contentEditableRef = ref()
export const chatMainRef = ref<HTMLDivElement>()

export interface Edition {
  messageId?: number
  content?: string
  inReplyTo?: InReplyTo
}

export const edition = reactive<Edition>({})

export const inReplyTos = reactive<InReplyTos>({})
export const chatListSearch = ref('')

// #endregion
