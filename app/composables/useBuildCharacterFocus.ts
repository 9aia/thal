import type { Component } from 'vue'

const mainField = ref<Component>()

export default function useBuildCharacterFocus() {
  const focusMainField = () => {
    if (mainField.value) {
      if (mainField.value) {
        (mainField.value as any).focus()
      }
    }
  }

  return { mainField, focusMainField }
}
