import type { Component } from 'vue'

const mainField = ref<Component>()

export default function useBuildPersonaFocus() {
  const focusMainField = () => {
    if (mainField.value) {
      setTimeout(() => {
        if (mainField.value) {
          (mainField.value as any).focus()
        }
      }, 500)
    }
  }

  return { mainField, focusMainField }
}
