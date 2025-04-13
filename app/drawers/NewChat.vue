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
  { id: 'new-contact', icon: 'person_add', name: t('New contact'), onClick: () => manageContact(null) },
  { id: 'create-character', icon: 'engineering', name: t('Build character'), onClick: () => buildCharacter(null) },
]

const { focusMainField: focusSearch } = useDiscoverFocus()

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')

  await nextTick()

  focusSearch()
}

const discoverItems: MenuItemType[] = [
  { id: 'discover-characters', icon: 'groups_3', name: t('Characters'), onClick: () => goToDiscover() },
]

const form = useForm({
  initialValues: {
    search: '',
  },
})
const search = refDebounced(toRef(form.values, 'search'), 500)

const localeWithDefaultRegion = useLocaleDefaultRegion()

const {
  data: contacts,
  isError,
  isPending,
  refetch,
} = await useServerQuery('/api/contact', {
  queryKey: queryKeys.contactsSearch(search),
  params: () => {
    return {
      search: search.value,
      locale: localeWithDefaultRegion.value,
    }
  },
})

function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false
  drawers.newChat = false

  navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <Navbar :title="t('New chat')" @close="emit('close')" />

  <div class="py-4 flex-1 overflow-y-auto bg-white space-y-4">
    <div class="px-4 mb-2">
      <SearchField
        :placeholder="t('Search name or username...')"
        path="search"
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
          @click="handleGoToChat(contact.characterUsername)"
        />
      </Resource>
    </SettingSection>
  </div>
</template>
