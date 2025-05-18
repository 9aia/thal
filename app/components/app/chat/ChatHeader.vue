<script lang="ts" setup>
import { manageContact, openContactView } from '~/store'
import type { MenuItemType } from '~/components/ui/navigation/types'

const props = defineProps<{
  displayName: string
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
    icon: 'material-symbols:contact-page-outline',
    onClick: () => openContactView({ username: props.username, displayName: props.displayName, avatarName: props.avatarName }),
  },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share',
    onClick: () => copyUrl(),
  },
  props.hasContact
    ? {
        id: 'edit-contact',
        name: t('Edit contact'),
        icon: 'material-symbols:edit-outline',
        onClick: () => {
          manageContact({
            id: props.username,
            username: props.username,
            name: props.displayName,
          })
        },
      }
    : null,
  props.hasContact
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
        onClick: () => props.addContact(),
      },
  props.hasMessages
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
    <ContactDeleteModal
      v-model="contactDeleteModalState"
      :contact-username="username"
      :character-name="displayName"
      :character-username="username"
    />

    <label for="my-drawer" class="lg:hidden btn btn-ghost btn-circle text-black drawer-button">
      <Icon name="material-symbols:arrow-back" />
    </label>

    <Avatar :name="avatarName" class="w-10 text-sm" type="button" @click="openContactView({ username, displayName, avatarName })" />

    <div class="flex-1 flex items-center justify-between gap-4">
      <div tabindex="0" role="button" class="block w-full" @click="openContactView({ username, displayName, avatarName })">
        <span class="text-gray-800">
          {{ displayName }}
        </span>
      </div>

      <div>
        <div class="dropdown dropdown-end">
          <Button size="md" shape="circle" class="btn-ghost">
            <Icon>material-symbols:more-vert</Icon>
          </Button>

          <Menu :items="items" item-class="py-2" />
        </div>
      </div>
    </div>
  </header>
</template>
