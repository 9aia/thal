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

export const contactViewUsername = ref<string>()

export function openContactView(username: string) {
  contactViewUsername.value = username

  rightDrawer.value = true
  rightDrawers.contactView = true
}

const { focusMainField: focusContactMainField } = useNewContactFocus()

export async function manageContact(data?: Contact | null) {
  if (data) {
    contactData.value = data
  }
  else {
    contactData.value = null
  }

  isRootDrawerOpen.value = true
  drawers.manageContact = true

  await nextTick()

  focusContactMainField()
}

/* Chat */

export const replies = reactive<Replies>({})
export const chatItemSearch = ref('')

export const sendingChatIds = ref<Set<number>>(new Set())
export const sentErrorChatIds = ref<Set<number>>(new Set())

export const currentPlayingMessage = ref<string | null>(null)

/* Character */

export const characterBuilderData = ref<Character | null>(null)

export const { focusMainField: focusCharacterMainField } = useBuildCharacterFocus()

export async function buildCharacter(data?: Character | null) {
  if (data) {
    characterBuilderData.value = data
  }
  else {
    characterBuilderData.value = null
  }

  isRootDrawerOpen.value = true
  drawers.characterBuilder = true

  await nextTick()

  focusCharacterMainField()
}
