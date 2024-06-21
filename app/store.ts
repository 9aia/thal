import type { SectionName } from "./constants/course"

interface Store {
  currentSection: SectionName
}

export const learnStore = reactive<Store>({
  currentSection: "a1",
})
