<script lang="ts" setup>
import type { MenuItemType, MenuItemTypeOrFalse } from '~/components/ui/navigation/types'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import { buildCharacter, manageContact, openContactView } from '~/store'

const { t } = useI18nExperimental()
const copyUrl = useCopyUrl()
const route = useRoute()
const user = useUser()
const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)
const contactDeleteModalState = ref()
const chatClearModalState = ref()

const username = computed(() => route.params.username as string)

const characterQuery = useCharacterQuery(username)
const contactQuery = useContactQuery(username)
const historyQuery = useHistoryQuery(username)

const queryPromises = [
  characterQuery.suspense(),
  contactQuery.suspense(),
  historyQuery.suspense(),
]

await Promise.all(queryPromises)

const usernameNotFound = computed(() => !characterQuery.data.value?.usernameId)
const isContact = computed(() => !!contactQuery.data.value?.id)
const contactNames = computed(() => getContactName({
  username: username.value,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))
const hasMessages = computed(() => !!historyQuery.data.value?.length)
const isCharacterFromLoggedUser = computed(() => {
  return characterQuery.data.value?.creatorId === user.value?.id
})

function editCharacter() {
  buildCharacter(characterQuery.data.value?.id)
  sidebar.push('build-character')
}

function editContact() {
  manageContact(username.value)
  sidebar.push('manage-contact')
}

function addContact() {
  manageContact(username.value, characterQuery.data.value?.name)
  sidebar.push('manage-contact')
}

const items = computed(() => ([
  {
    id: 'view-contact',
    name: t('View contact'),
    icon: 'material-symbols:contact-page-outline-rounded',
    onClick: () => openContactView(username.value),
  },
  isCharacterFromLoggedUser.value && {
    id: 'build-character',
    name: t('Edit character'),
    icon: 'material-symbols:frame-person-outline-rounded',
    onClick: () => editCharacter(),
  },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share-rounded',
    onClick: () => copyUrl(),
  },
  isContact.value && {
    id: 'edit-contact',
    name: t('Edit contact'),
    icon: 'material-symbols:person-edit-outline-rounded',
    onClick: () => editContact(),
  },
  isContact.value
    ? {
        id: 'delete-contact',
        name: t('Delete contact'),
        icon: 'material-symbols:person-remove-outline-rounded',
        onClick: () => contactDeleteModalState.value = true,
      }
    : {
        id: 'add-contact',
        name: t('Add to contacts'),
        icon: 'material-symbols:person-add-outline-rounded',
        onClick: () => addContact(),
      },
  hasMessages.value && {
    id: 'clear-chat',
    name: t('Clear chat'),
    icon: 'material-symbols:mop-outline',
    meaning: 'danger',
    onClick: () => chatClearModalState.value = true,
  },
] satisfies MenuItemTypeOrFalse[]).filter(Boolean) as MenuItemType[])
</script>

<template>
  <header
    class="p-4 bg-white flex gap-3 w-full"
    :class="{
      'cursor-pointer': !usernameNotFound,
    }"
    @click="!usernameNotFound && openContactView(username)"
  >
    <Button
      as="label"
      for="sidebar-drawer"
      class="lg:hidden btn btn-neutral btn-md btn-ghost btn-circle drawer-button"
      icon="material-symbols:arrow-back-rounded"
      @click.stop="sidebar.open.value = true"
    />

    <Avatar
      :name="contactNames.avatarName"
      wrapper-class="bg-neutral text-content-neutral"
      type="div"
      size="sm"
    />

    <div class="flex-1 flex items-center justify-between gap-4">
      <div class="block w-full">
        <span class="text-gray-800">
          {{ contactNames.displayName }}
        </span>
      </div>

      <div v-if="!usernameNotFound" class="flex gap-1">
        <Dropdown class="dropdown-end">
          <Button
            class="btn btn-neutral btn-circle btn-md btn-ghost"
            icon="material-symbols:more-vert"
            @click.stop
          />

          <DropdownContent :items="items" />
        </Dropdown>
      </div>
    </div>

    <ContactDeleteModal
      v-if="isContact"
      v-model="contactDeleteModalState"
      :contact-name="contactQuery.data.value?.name!"
      :contact-username="username"
    />

    <LazyHistoryClearModal
      v-if="hasMessages"
      v-model="chatClearModalState"
      :username="username"
    />
  </header>
</template>
