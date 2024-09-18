import { contactData, drawers } from "~/store"

export function useContactInfo(data: Ref<any>) {
  const hasContact = computed(() => {
    return !!data.value?.contact
  })

  const displayName = computed(() => {
    return data.value?.contact?.name || `@${data.value?.username}`
  })

  const addContact = () => {
    if (!data.value)
      return

    drawers.newContact = true
    contactData.value = {
      name: data.value.persona?.name,
      username: data.value.username,
    }
  }

  return {
    displayName,
    hasContact,
    addContact,
  }
}
