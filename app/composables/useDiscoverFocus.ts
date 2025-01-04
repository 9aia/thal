import type { Component } from 'vue'

const mainField = ref<Component>()

interface FocusOptions {
  immediate?: boolean
}

export default function useDiscoverFocus() {
  const focusMainField = (options: FocusOptions = { immediate: false }) => {
    const immediate = options.immediate || false

    if (!mainField.value)
      return

    if (immediate) {
      (mainField.value as any).focus()
      return
    }

    setTimeout(() => {
      if (mainField.value) {
        (mainField.value as any).focus()
      }
    }, 10)
  }

  return { mainField, focusMainField }
}
