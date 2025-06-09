<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import type { MenuItemType } from '~/components/ui/navigation/types'
import queryKeys from '~/queryKeys'
import { buildCharacter, drawers, isRootDrawerOpen, manageContact } from '~/store'

const emit = defineEmits<({
  (e: 'close'): void
})>()

useAutoRedirect({
  query: { drawer: ['new'] },
})

const { t } = useI18nExperimental()

const generalItems: MenuItemType[] = [
  { id: 'new-contact', icon: 'material-symbols:person-add-outline-rounded', name: t('New contact'), onClick: () => manageContact(null) },
  { id: 'create-character', icon: 'material-symbols:frame-person-outline-rounded', name: t('Build character'), onClick: () => buildCharacter(null) },
]

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

const discoverItems: MenuItemType[] = [
  { id: 'discover-characters', icon: 'material-symbols:person-search-outline-rounded', name: t('Characters'), onClick: () => goToDiscover() },
]

const form = useForm({
  initialValues: {
    search: '',
  },
})
const search = refDebounced(toRef(() => form.values.search), 500)

const localeWithDefaultRegion = useLocaleDefaultRegion()

const headers = useRequestHeaders(['cookie'])
const contactsQuery = useServerQuery({
  queryKey: queryKeys.contactsSearch(search),
  queryFn: () => $fetch('/api/contact', {
    headers,
    params: {
      search: search.value,
      locale: localeWithDefaultRegion.value,
    },
  }),
})

async function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false
  drawers.newChat = false

  await navigateTo(`/app/chat/${username}`)
}

const emptyMessage = computed(() => {
  if (search.value) {
    return t('No contacts found for "{query}"', { query: search.value })
  }

  return t('No contacts found.')
})
</script>

<template>
  <Navbar :title="t('New chat')" @close="emit('close')" />

  <div class="pb-4 flex-1 overflow-y-auto bg-white space-y-4 pt-2">
    <form class="px-4">
      <SearchField
        v-model="form.values.search"
        :placeholder="t('Search name or username...')"
        path="search"
        autofocus
        input-class="input-lg input-primary w-full"
      />
    </form>

    <SettingSection body-class="px-5">
      <MenuGroup :items="generalItems" />
    </SettingSection>

    <SettingSection :title="t('Discover')" title-class="px-5" body-class="px-5">
      <MenuGroup :items="discoverItems" />
    </SettingSection>

    <SettingSection :title="t('Contacts')" title-class="px-5" body-class="px-5 space-y-2">
      <CommonResource
        :for="contactsQuery"
        :empty-message="emptyMessage"
      >
        <ContactItem
          v-for="contact in contactsQuery.data.value"
          :key="`contact-${contact.contactId}`"
          :name="contact.contactName"
          :description="contact.characterDescription"
          @click="handleGoToChat(contact.username)"
        />
      </CommonResource>
    </SettingSection>
  </div>
</template>
