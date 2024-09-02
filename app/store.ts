import type { SectionName } from "./constants/course"
import type { Persona } from "~/types"

interface Store {
  currentSection: SectionName
}

export const learnStore = reactive<Store>({
  currentSection: "a1",
})

export const drawers = reactive({
  profile: false,
  account: false,
  settings: false,
  newChat: false,
  personaBuilder: false,
  newContact: false,
  myPersonas: false,
})

export const personaBuilderData = ref<Persona | null>(null)
