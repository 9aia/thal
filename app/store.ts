import type { SectionName } from "./constants/course"
import type { Contact, Persona, Replies } from "~/types"

interface Store {
  currentSection: SectionName
}

export const learnStore = reactive<Store>({
  currentSection: "a1",
})

export const isRootDrawerOpen = ref(false)

export const drawers = reactive({
  profile: false,
  account: false,
  settings: false,
  newChat: false,
  personaBuilder: false,
  newContact: false,
  myPersonas: false,
})

export const rightDrawer = ref(false)
export const rightDrawers = reactive({
  contactView: false,
  translation: false,
})

export const personaBuilderData = ref<Persona | null>(null)
export const contactData = ref<Contact | null>(null)

export const reply = ref<Replies>({})
