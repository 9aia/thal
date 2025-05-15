import type { Character, Contact, Replies } from '~/types'

export const contentEditableRef = ref()

/* Core */

export const isPastDueModalOpen = ref(false)
export const isPastDueModalAlreadyShown = ref(false)

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
  contactView: false,
  translation: false,
})

/* Contact */

export const contactData = ref<Contact | null>(null)

watch(() => drawers.manageContact, (value) => {
  if (!value) {
    contactData.value = null
  }
})

export interface ContactInfoData {
  username?: string
  displayName?: string
  avatarName?: string
}
export const contactInfoData = ref<ContactInfoData | null>(null)

export function openContactView(data: ContactInfoData) {
  contactInfoData.value = data

  rightDrawer.value = true
  rightDrawers.contactView = true
}

export async function manageContact(data?: Contact | null) {
  if (data) {
    contactData.value = data
  }
  else {
    contactData.value = null
  }

  isRootDrawerOpen.value = true
  drawers.manageContact = true
}

/* Chat */

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

/* Character */

export const characterBuilderData = ref<Character | null>(null)

export async function buildCharacter(data?: Character | null) {
  if (data) {
    characterBuilderData.value = data
  }
  else {
    characterBuilderData.value = null
  }

  isRootDrawerOpen.value = true
  drawers.characterBuilder = true
}
