const isWhatsNewModalOpen = ref(false)

export function useWhatsNewModal() {
  const open = () => {
    isWhatsNewModalOpen.value = true
  }

  const close = () => {
    isWhatsNewModalOpen.value = false
  }

  return {
    state: isWhatsNewModalOpen,
    open,
    close,
  }
}
