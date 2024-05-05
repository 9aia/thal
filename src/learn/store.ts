import type { Section } from "./types"

interface Store {
  currentSection: Section["id"]
}

export const learnStore = reactive<Store>({
  currentSection: "a1",
})
