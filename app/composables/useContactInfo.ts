import { contactData, drawers, isRootDrawerOpen } from "~/store"

export function useContactInfo(data: Ref<any>) {
  const { focusMainField } = useNewContactFocus()

  const hasContact = computed(() => {
    return !!data.value?.contact
  })

  const displayName = computed(() => {
    return data.value?.contact?.name || data.value?.name || data.value?.persona?.name
  })

  const avatarName = computed(() => {
    return data.value?.contact?.name || data.value?.name
  })

  const addContact = () => {
    if (!data.value)
      return

    contactData.value = {
      name: data.value.persona?.name,
      username: data.value.username,
    }
    isRootDrawerOpen.value = true
    drawers.newContact = true
    focusMainField()
  }

  return {
    displayName,
    avatarName,
    hasContact,
    addContact,
  }
}
