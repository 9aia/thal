import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { InReplyTos } from '~/types'
import type { InReplyTo } from '~~/db/schema'

// #region Modal

export const isPastDueModalOpen = ref(false)
export const isPastDueModalAlreadyShown = ref(false)

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

// #region ContactManager

export const manageContactUsername = ref<string | null>(null)
export const manageContactName = ref<string>()

export async function manageContact(username?: string | null, name?: string | null) {
  manageContactUsername.value = username ?? null
  manageContactName.value = name ?? undefined

  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = computed(() => breakpoints.smaller('lg').value)

  const sidebar = useSidebar()
  sidebar.push('manage-contact')

  if (isMobile.value && !sidebar.open.value) {
    sidebar.animate.value = false
  }
  if (!isMobile.value) {
    sidebar.animate.value = true
  }

  sidebar.open.value = true
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

export const currentPlayingMessageId = ref<number | null>(null)

// #endregion

// #region CharacterBuilder

export const characterBuildId = ref<number | null>(null)
export const characterBuildPrompt = ref<string>()

export async function buildCharacter(characterId?: number | null, prompt?: string) {
  characterBuildId.value = characterId ?? null
  characterBuildPrompt.value = prompt

  const breakpoints = useBreakpoints(breakpointsTailwind)
  const isMobile = computed(() => breakpoints.smaller('lg').value)

  const sidebar = useSidebar()
  sidebar.push('build-character')
  sidebar.animate.value = !isMobile.value || sidebar.open.value
  sidebar.open.value = true
}

// #endregion
