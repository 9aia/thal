<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { buildCharacter, manageContact, openContactView } from '~/store'
import type { MenuItemType } from '~/components/ui/navigation/types'
import queryKeys from '~/queryKeys'

const { t } = useI18nExperimental()
const copyUrl = useCopyUrl()
const route = useRoute()
const localeWithDefaultRegion = useLocaleDefaultRegion()

const username = computed(() => route.params.username as string)

const clearChat = useClearChat(username)

const contactDeleteModalState = ref()

const contactQuery = useServerQuery(`/api/contact/${username.value}` as `/api/contact/:username`, {
  queryKey: queryKeys.contact(username),
})

const characterQuery = useServerQuery(() => `/api/character/${username.value}?locale=${localeWithDefaultRegion.value}` as `/api/character/:username`, {
  queryKey: queryKeys.character(localeWithDefaultRegion.value, username),
})

const isContact = computed(() => !!contactQuery.data.value)
const contactNames = computed(() => getContactName({
  username: username.value,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))

const hasMessages = computed(() => false) // TODO: use query

const items = computed(() => [
  {
    id: 'view-contact',
    name: t('View contact'),
    icon: 'material-symbols:contact-page-outline',
    onClick: () => openContactView(username.value),
  },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share',
    onClick: () => copyUrl(),
  },
  isContact.value
    ? {
        id: 'edit-contact',
        name: t('Edit contact'),
        icon: 'material-symbols:edit-outline',
        onClick: () => manageContact(username.value),
      }
    : null,
  isContact.value
    ? {
        id: 'delete-contact',
        name: t('Delete contact'),
        icon: 'material-symbols:delete-outline',
        onClick: () => contactDeleteModalState.value = true,
      }
    : {
        id: 'add-contact',
        name: t('Add to contacts'),
        icon: 'material-symbols:add',
        onClick: () => manageContact(username.value, characterQuery.data.value?.name),
      },
  hasMessages.value
    ? {
        id: 'clear-chat',
        name: t('Clear chat'),
        icon: 'material-symbols:mop-outline',
        meaning: 'danger',
        onClick: () => clearChat(),
      }
    : null,
].filter(item => item !== null) as MenuItemType[])
</script>

<template>
  <header class="px-3 py-2 bg-white flex gap-2 w-full">
    <label for="my-drawer" class="lg:hidden btn btn-ghost btn-circle text-black drawer-button">
      <Icon name="material-symbols:arrow-back" />
    </label>

    <Avatar :name="contactNames.avatarName" class="w-10 text-sm" type="button" @click="openContactView(username)" />

    <div class="flex-1 flex items-center justify-between gap-4">
      <div tabindex="0" role="button" class="block w-full" @click="openContactView(username)">
        <span class="text-gray-800">
          {{ contactNames.displayName }}
        </span>
      </div>

      <div class="flex gap-2">
        <Button size="md" shape="circle" class="btn-ghost" @click="buildCharacter(characterQuery.data.value?.id)">
          <Icon>material-symbols:person-edit-outline</Icon>
        </Button>

        <div class="dropdown dropdown-end">
          <Button size="md" shape="circle" class="btn-ghost">
            <Icon>material-symbols:more-vert</Icon>
          </Button>

          <Menu :items="items" item-class="py-2" />
        </div>
      </div>
    </div>

    <ContactDeleteModal
      v-if="isContact"
      v-model="contactDeleteModalState"
      :contact-name="contactQuery.data.value?.name ?? ''"
      :contact-username="username"
    />
  </header>
</template>
