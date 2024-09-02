const discoverPersonasModalState = reactive<{
  modelValue: boolean
}>({
  modelValue: false,
})

export function useDiscoverPersonasModal() {
  const open = () => {
    discoverPersonasModalState.modelValue = true
  }

  const close = () => {
    discoverPersonasModalState.modelValue = false
  }

  return {
    open,
    close,
    discoverPersonasModalState,
  }
}
