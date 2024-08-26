import type { SectionName } from "./constants/course"

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
})
