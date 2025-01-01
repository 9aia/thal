import type { Contact, Persona, Replies } from '~/types'

export const isRootDrawerOpen = ref(false)

export const drawers = reactive({
  newContact: false,
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

export const replies = reactive<Replies>({})
export const personaBuilderData = ref<Persona | null>(null)
export const contactData = ref<Contact | null>(null)

export const chatItemSearch = ref('')

export const contactViewUsername = ref<string>()

export function openContactView(username: string) {
  contactViewUsername.value = username

  rightDrawer.value = true
  rightDrawers.contactView = true
}

export const sendingChatIds = ref<Set<number>>(new Set())
export const sentErrorChatIds = ref<Set<number>>(new Set())
