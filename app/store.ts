import type { Replies } from '~/types'

export const contentEditableRef = ref()

// #region PastDueModal

export const isPastDueModalOpen = ref(false)
export const isPastDueModalAlreadyShown = ref(false)

// #endregion

// #region Drawers

export const isRootDrawerOpen = ref(false)

export const drawers = reactive({
  manageContact: false,
  account: false,
  settings: false,
  newChat: false,
  characterBuilder: false,
  myCharacters: false,
  profile: false,
})

watch(isRootDrawerOpen, (value) => {
  if (!value) {
    setTimeout(() => {
      for (const key in drawers) {
        (drawers as any)[key] = false
      }
    }, 500)
  }
})

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

export async function manageContact(username?: string | null, name?: string) {
  manageContactUsername.value = username ?? null
  manageContactName.value = name

  isRootDrawerOpen.value = true
  drawers.manageContact = true
}

// #endregion

// #region Chat

export interface Edition {
  editing: boolean
  message: string
  editingMessageId: number | null
}

export const edition = reactive<Edition>({
  editing: false,
  message: '',
  editingMessageId: null,
})

export const replies = reactive<Replies>({})
export const chatItemSearch = ref('')

export const sendingChatIds = ref<Set<number>>(new Set())
export const sentErrorChatIds = ref<Set<number>>(new Set())

export const currentPlayingMessage = ref<string | null>(null)

// #endregion

// #region CharacterBuilder

export const characterBuildId = ref<number | null>(null)
export const characterBuildPrompt = ref<string>()

export async function buildCharacter(characterId?: number | null, prompt?: string) {
  characterBuildId.value = characterId ?? null
  characterBuildPrompt.value = prompt

  isRootDrawerOpen.value = true
  drawers.characterBuilder = true
}

// #endregion
