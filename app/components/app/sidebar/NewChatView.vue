<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { refDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import type { MenuItemType } from '~/components/ui/navigation/types'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import queryKeys from '~/queryKeys'
import { buildCharacter, manageContact } from '~/store'

const { t } = useI18nExperimental()
const localeWithDefaultRegion = useLocaleWithDefaultRegion()
const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)

function createCharacter() {
  buildCharacter(null)
  sidebar.push('build-character')
}

function addContact() {
  manageContact(null)
  sidebar.push('manage-contact')
}

const generalItems = computed<MenuItemType[]>(() => [
  { id: 'create-character', icon: 'material-symbols:frame-person-outline-rounded', name: t('Build character'), onClick: () => createCharacter() },
  { id: 'new-contact', icon: 'material-symbols:person-add-outline-rounded', name: t('New contact'), onClick: () => addContact() },
])

const discoverItems = computed<MenuItemType[]>(() => [
  {
    id: 'discover-characters',
    icon: 'material-symbols:person-search-outline-rounded',
    name: t('Characters'),
    href: '/app/discover',
    onClick: () => sidebar.open.value = false,
  },
])

const form = useForm({
  initialValues: {
    search: '',
  },
})
const search = refDebounced(toRef(() => form.values.search), 500)

const headers = useRequestHeaders(['cookie'])
const contactsQuery = useQuery({
  queryKey: queryKeys.contactsSearch(search),
  queryFn: () => $fetch('/api/contact', {
    headers,
    params: {
      search: search.value,
      locale: localeWithDefaultRegion.value,
    },
  }),
})

await contactsQuery.suspense()

const emptyMessage = computed(() => {
  if (search.value) {
    return t('No contacts found for "{query}"', { query: search.value })
  }

  return t('You have no contacts yet.')
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      :title="t('New chat')"
      @back="sidebar.back()"
    />

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
          common-error-fallback-class="px-2"
        >
          <ContactItem
            v-for="contact in contactsQuery.data.value"
            :key="`contact-${contact.contactId}`"
            :name="contact.contactName"
            :description="contact.characterDescription"
            class="px-2"
            @click="navigateTo(`/app/chat/${contact.username}`)"
          />
        </CommonResource>
      </SettingSection>
    </div>
  </div>
</template>
