import type { Component } from 'vue'

const mainField = ref<Component>()

export default function useNewContactFocus() {
  const focusMainField = () => {
    if (mainField.value) {
      if (mainField.value) {
        (mainField.value as any).focus()
      }
    }
  }

  return { mainField, focusMainField }
}
