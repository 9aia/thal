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
  { id: 'create-character', icon: 'material-symbols:frame-person-outline-rounded', name: t('Build character'), onClick: () => buildCharacter(null) },
  { id: 'new-contact', icon: 'material-symbols:person-add-outline-rounded', name: t('New contact'), onClick: () => manageContact(null) },
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

  return t('You have no contacts yet.')
})
</script>

<template>
  <Navbar :title="t('New chat')" @close="emit('close')" />

  <div class="pt-2 pb-4 flex-1 overflow-y-auto bg-white space-y-4">
    <form class="px-6">
      <SearchField
        v-model="form.values.search"
        :placeholder="t('Search name or username...')"
        path="search"
        autofocus
        input-class="input-lg input-primary w-full"
      />
    </form>

    <SettingSection
      title-class="px-6"
      body-class="px-4"
    >
      <ItemList :items="generalItems" />
    </SettingSection>

    <SettingSection
      :title="t('Discover')"
      title-class="px-6"
      body-class="px-4"
    >
      <ItemList :items="discoverItems" />
    </SettingSection>

    <SettingSection
      :title="t('Contacts')"
      title-class="px-6"
      body-class="px-4 space-y-2"
    >
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
