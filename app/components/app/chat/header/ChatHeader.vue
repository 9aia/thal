<script lang="ts" setup>
import { buildCharacter, isRootDrawerOpen, manageContact, openContactView } from '~/store'
import type { MenuItemType } from '~/components/ui/navigation/types'
import queryKeys from '~/queryKeys'

const { t } = useI18nExperimental()
const copyUrl = useCopyUrl()
const route = useRoute()
const contactDeleteModalState = ref()

const username = computed(() => route.params.username as string)

const clearChat = useClearChat(username)
const characterNotFound = useState('characterNotFound', () => false)

const characterQuery = useCharacterQuery(username)

const headers = useRequestHeaders(['cookie'])
const contactQuery = useServerQuery({
  queryKey: queryKeys.contact(username),
  queryFn: () => $fetch(`/api/contact/${username.value}`, {
    headers,
  }),
})

const isContact = computed(() => !!contactQuery.data.value?.id)
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
    icon: 'material-symbols:contact-page-outline-rounded',
    onClick: () => openContactView(username.value),
  },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share-rounded',
    onClick: () => copyUrl(),
  },
  isContact.value
    ? {
        id: 'edit-contact',
        name: t('Edit contact'),
        icon: 'material-symbols:person-edit-outline-rounded',
        onClick: () => manageContact(username.value),
      }
    : null,
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
  <header
    class="p-4 bg-white flex gap-3 w-full"
    :class="{
      'cursor-pointer': !characterNotFound,
    }"
    @click="!characterNotFound && openContactView(username)"
  >
    <button
      as="label"
      for="my-drawer"
      class="lg:hidden btn btn-neutral btn-md btn-ghost btn-circle drawer-button"
      @click.stop="isRootDrawerOpen = true"
    >
      <Icon name="material-symbols:arrow-back-rounded" />
    </button>

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

      <div v-if="!characterNotFound" class="flex gap-1">
        <button
          class="btn btn-neutral btn-circle btn-md btn-ghost"
          @click.stop="buildCharacter(characterQuery.data.value?.id)"
        >
          <Icon name="material-symbols:frame-person-outline-rounded" />
        </button>

        <div class="dropdown dropdown-end">
          <button
            class="btn btn-neutral btn-circle btn-md btn-ghost"
            @click.stop
          >
            <Icon name="material-symbols:more-vert" />
          </button>

          <Menu :items="items" />
        </div>
      </div>
    </div>

    <ContactDeleteModal
      v-if="isContact"
      v-model="contactDeleteModalState"
      :contact-name="contactQuery.data.value?.name!"
      :contact-username="username"
    />
  </header>
</template>
