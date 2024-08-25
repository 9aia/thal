const profileModalState = reactive<{
  modelValue: boolean
  username: string | null
}>({
  modelValue: false,
  username: null,
})

export function useProfileModal() {
  const open = (username: string) => {
    profileModalState.username = username
    profileModalState.modelValue = true
  }

  const close = () => {
    profileModalState.modelValue = false
  }

  return {
    profileModalState,
    open,
    close,
  }
}
