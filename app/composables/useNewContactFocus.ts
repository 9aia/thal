import type { Component } from 'vue'

const nameField = ref<Component>()

export default function useNewContactFocus() {
  const focusMainField = () => {
    if (nameField.value) {
      setTimeout(() => {
        if (nameField.value) {
          (nameField.value as any).focus()
        }
      }, 10)
    }
  }

  return { mainField: nameField, focusMainField }
}
