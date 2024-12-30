const isLocaleModalOpen = ref(false)

export function useLocaleModal() {
  const open = () => {
    isLocaleModalOpen.value = true
  }

  const close = () => {
    isLocaleModalOpen.value = false
  }

  return {
    state: isLocaleModalOpen,
    open,
    close,
  }
}
