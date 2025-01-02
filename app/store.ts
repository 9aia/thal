import type { Contact, Persona, Replies } from '~/types'

/* Core */

export const isRootDrawerOpen = ref(false)

export const drawers = reactive({
  manageContact: false,
  profileSettings: false,
  account: false,
  settings: false,
  newChat: false,
  personaBuilder: false,
  myPersonas: false,
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

export function manageContact(data?: Contact | null) {
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

export const replies = reactive<Replies>({})
export const chatItemSearch = ref('')

export const sendingChatIds = ref<Set<number>>(new Set())
export const sentErrorChatIds = ref<Set<number>>(new Set())

/* Character */

export const personaBuilderData = ref<Persona | null>(null)
