import { manageContact } from '~/store'

export function useContactInfo(data: Ref<any>) {
  const hasContact = computed(() => {
    return !!data.value?.contact
  })

  const displayName = computed(() => {
    return data.value?.contact?.name || data.value?.name || `@${data.value?.username}`
  })

  const avatarName = computed(() => {
    return data.value?.contact?.name || data.value?.name || data.value?.username
  })

  const addContact = () => {
    if (!data.value)
      return

    manageContact({
      name: data.value.name,
      username: data.value.username,
    })
  }

  return {
    displayName,
    avatarName,
    hasContact,
    addContact,
  }
}
