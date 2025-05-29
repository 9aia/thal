<script setup lang="ts">
import { t } from '@psitta/vue'
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

const generalItems: MenuItemType[] = [
  { id: 'new-contact', icon: 'material-symbols:person-add-outline-rounded', name: t('New contact'), onClick: () => manageContact(null) },
  { id: 'create-character', icon: 'material-symbols:engineering-outline-rounded', name: t('Build character'), onClick: () => buildCharacter(null) },
]

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

const discoverItems: MenuItemType[] = [
  { id: 'discover-characters', icon: 'material-symbols:groups-3-outline-rounded', name: t('Characters'), onClick: () => goToDiscover() },
]

const form = useForm({
  initialValues: {
    search: '',
  },
})
const search = refDebounced(toRef(() => form.values.search), 500)

const localeWithDefaultRegion = useLocaleDefaultRegion()

const {
  data: contacts,
  isError,
  isPending,
  refetch,
} = useServerQuery('/api/contact', {
  queryKey: queryKeys.contactsSearch(search),
  query: () => {
    return {
      search: search.value,
      locale: localeWithDefaultRegion.value,
    }
  },
})

async function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false
  drawers.newChat = false

  await navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <Navbar :title="t('New chat')" @close="emit('close')" />

  <div class="py-4 flex-1 overflow-y-auto bg-white space-y-4">
    <div class="px-4 mb-2">
      <SearchField
        :placeholder="t('Search name or username...')"
        path="search"
        autofocus
      />
    </div>

    <SettingSection class="px-4">
      <MenuGroup
        class="p-0 w-full"
        item-class="py-2"
        :items="generalItems"
      />
    </SettingSection>

    <SettingSection :title="t('Discover')" class="px-4">
      <MenuGroup
        class="p-0 w-full"
        item-class="py-2"
        :items="discoverItems"
      />
    </SettingSection>

    <SettingSection :title="t('Contacts')" title-class="px-4">
      <Resource
        :error="isError"
        :loading="isPending"
        @execute="refetch"
      >
        <template v-if="!contacts.length">
          <p class="text-gray-500 text-sm py-2 px-6 text-center">
            {{ search ? t(`No results found for "{query}"`, { query: search }) : t('No results found.') }}
          </p>
        </template>

        <ContactItem
          v-for="contact in contacts"
          v-else
          :key="`contact-${contact.contactId}`"
          :name="contact.contactName"
          :description="contact.characterDescription"
          @click="handleGoToChat(contact.username)"
        />
      </Resource>
    </SettingSection>
  </div>
</template>
