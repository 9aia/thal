<script lang="ts" setup>
import { useI18n } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { manageContact, openContactView } from '~/store'
import type { MenuItem } from '~~/layers/ui/components/navigation/types'

const props = defineProps<{
  name: string
  username: string
  avatarName: string
  hasContact: boolean
  hasMessages: boolean
  addContact: () => void
}>()

const { t } = useI18n()
const toast = useToast()
const copyUsername = useCopyUsername(props.username)

const contactDeleteModalState = ref()

const queryClient = useQueryClient()

const {
  mutate: clearMessage,
} = useMutation({
  mutationFn: () => $fetch(`/api/chat/history/${props.username}`, { method: 'DELETE' }),
  onError: () => {
    toast.error(t('Failed to clear chat'))
  },
  onSuccess: () => {
    toast.success(t('Chat has been cleared'))

    queryClient.invalidateQueries({
      queryKey: queryKeys.chat(props.username),
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.chats,
    })
  },
})

const items = computed<MenuItem[]>(() => [
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
    onClick: () => copyUsername(),
  },
  props.hasMessages
    ? {
        id: 'clear-chat',
        name: t('Clear chat'),
        icon: 'mop',
        onClick: () => clearMessage(),
      }
    : null,
  props.hasContact
    ? {
        id: 'edit-contact',
        name: t('Edit Contact'),
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
        name: t('Delete Contact'),
        icon: 'delete',
        onClick: () => {
          contactDeleteModalState.value = true
        },
      }
    : {
        id: 'add-contact',
        name: t('Add Contact'),
        icon: 'add',
        onClick: () => {
          props.addContact()
        },
      },
].filter(item => item !== null))
</script>

<template>
  <header class="px-3 py-2 bg-slate-800 flex gap-2">
    <ContactDeleteModal v-model="contactDeleteModalState" :contact-username="username" />

    <label for="my-drawer" class="lg:hidden btn btn-ghost btn-circle text-primary drawer-button">
      <Icon name="arrow_back" />
    </label>

    <Avatar :name="avatarName" class="w-10 text-sm" type="button" @click="openContactView(username)" />

    <div class="flex-1 flex items-center justify-between gap-4">
      <div tabindex="0" role="button" class="block text-primary w-full" @click="openContactView(username)">
        {{ name }}
      </div>

      <div>
        <div class="dropdown dropdown-end">
          <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
            <Icon>more_vert</Icon>
          </button>

          <Menu :items="items" />
        </div>
      </div>
    </div>
  </header>
</template>
