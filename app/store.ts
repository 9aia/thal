import type { Section } from "../_old_maratongue/learn/types"

interface Store {
  currentSection: Section["id"]
}

export const learnStore = reactive<Store>({
  currentSection: "a1",
})
