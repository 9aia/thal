import type { Contact, Persona, Replies } from "~/types"

export const isRootDrawerOpen = ref(false)

export const drawers = reactive({
  profileSettings: false,
  account: false,
  settings: false,
  newChat: false,
  personaBuilder: false,
  newContact: false,
  myPersonas: false,
  profile: false,
})

export const rightDrawer = ref(false)
export const rightDrawers = reactive({
  contactView: false,
  translation: false,
})

export const replies = reactive<Replies>({})
export const personaBuilderData = ref<Persona | null>(null)
export const contactData = ref<Contact | null>(null)

export const contactViewUsername = ref<string>()

export function openContactView(username: string) {
  contactViewUsername.value = username

  rightDrawer.value = true
  rightDrawers.contactView = true
}

export const sendingChatIds = ref<Set<number>>(new Set())
export const sentErrorChatIds = ref<Set<number>>(new Set())
