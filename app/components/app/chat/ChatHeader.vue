<script lang="ts" setup>
import { manageContact, openContactView } from '~/store'
import type { MenuItemType } from '~/components/ui/navigation/types'

const props = defineProps<{
  name: string
  username: string
  avatarName: string
  hasContact: boolean
  hasMessages: boolean
  addContact: () => void
}>()

const { t } = useI18nExperimental()
const copyUrl = useCopyUrl()
const clearChat = useClearChat(toRef(() => props.username))

const contactDeleteModalState = ref()

const items = computed(() => [
  {
    id: 'view-contact',
    name: t('View contact'),
    icon: 'contact_page',
    onClick: () => openContactView(props.username),
  },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'ios_share',
    onClick: () => copyUrl(),
  },
  props.hasContact
    ? {
        id: 'edit-contact',
        name: t('Edit contact'),
        icon: 'edit',
        onClick: () => {
          manageContact({
            id: props.username,
            username: props.username,
            name: props.name,
          })
        },
      }
    : null,
  props.hasContact
    ? {
        id: 'delete-contact',
        name: t('Delete contact'),
        icon: 'delete',
        onClick: () => contactDeleteModalState.value = true,
      }
    : {
        id: 'add-contact',
        name: t('Add to contacts'),
        icon: 'add',
        onClick: () => props.addContact(),
      },
  props.hasMessages
    ? {
        id: 'clear-chat',
        name: t('Clear chat'),
        icon: 'mop',
        meaning: 'danger',
        onClick: () => clearChat(),
      }
    : null,
].filter(item => item !== null) as MenuItemType[])
</script>

<template>
  <header class="px-3 py-2 bg-white flex gap-2 w-full">
    <ContactDeleteModal v-model="contactDeleteModalState" :contact-username="username" />

    <label for="my-drawer" class="lg:hidden btn btn-ghost btn-circle text-black drawer-button">
      <Icon name="arrow_back" />
    </label>

    <Avatar :name="avatarName" class="w-10 text-sm" type="button" @click="openContactView(username)" />

    <div class="flex-1 flex items-center justify-between gap-4">
      <div tabindex="0" role="button" class="block w-full" @click="openContactView(username)">
        <span class="text-gray-800">
          {{ name }}
        </span>
      </div>

      <div>
        <div class="dropdown dropdown-end">
          <button class="btn btn-circle btn-ghost text-black">
            <Icon>more_vert</Icon>
          </button>

          <Menu :items="items" item-class="py-2" />
        </div>
      </div>
    </div>
  </header>
</template>
