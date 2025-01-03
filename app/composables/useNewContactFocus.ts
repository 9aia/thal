import type { Component } from 'vue'

const mainField = ref<Component>()

export default function useNewContactFocus() {
  const focusMainField = () => {
    if (mainField.value) {
      setTimeout(() => {
        if (mainField.value) {
          (mainField.value as any).focus()
        }
      }, 10)
    }
  }

  return { mainField, focusMainField }
}
