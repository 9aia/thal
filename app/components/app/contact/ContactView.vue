<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { useI18n } from '@psitta/vue'
import { contactViewUsername, manageContact, rightDrawer, rightDrawers } from '~/store'
import { categories } from '~/constants/discover'
import queryKeys from '~/queryKeys'
import type { MenuItem } from '~~/layers/ui/components/navigation/types'

const contactDeleteModalState = ref(false)

const username = computed(() => contactViewUsername!.value!)

const {
  data,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: queryKeys.contactInfo(username),
  queryFn: () => $fetch(`/api/contact-info/${username.value!}`),
  enabled: computed(() => !!username.value),
})

const { displayName, hasContact, avatarName, addContact } = useContactInfo(data)

const { t } = useI18n()
const copyUsername = useCopyUsername(contactViewUsername)

const items = computed<MenuItem[]>(() => [
  hasContact.value
    ? {
        id: 'edit-contact',
        name: t('Edit Contact'),
        icon: 'edit',
        onClick: () => {
          if (!data.value)
            return

          manageContact({
            id: data.value.username,
            username: data.value.username,
            name: data.value.contact.name,
          })
        },
      }
    : null,
  hasContact.value
    ? {
        id: 'delete-contact',
        name: t('Delete Contact'),
        icon: 'delete',
        onClick: () => contactDeleteModalState.value = true,
      }
    : {
        id: 'add-contact',
        name: t('Add Contact'),
        icon: 'add',
        onClick: () => addContact(),
      },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'ios_share',
    onClick: () => copyUsername(),
  },
].filter(item => item !== null))

function closeDrawer() {
  rightDrawer.value = false
  rightDrawers.contactView = false
}

const category = computed(() => {
  return categories.find(cat => cat.id === data.value?.persona?.categoryId)
})
</script>

<template>
  <div class="flex flex-col h-full w-96 bg-white">
    <ContactDeleteModal v-model="contactDeleteModalState" :contact-username="username" />

    <header class="px-3 py-2 flex gap-2">
      <h1 class="text-md py-2 text-slate-800 flex items-center gap-1">
        <Btn size="md" class="btn-ghost btn-circle" @click="closeDrawer">
          <Icon name="close" />
        </Btn>
        {{ t("Contact Info") }}
      </h1>

      <div class="flex-1 flex items-center justify-end gap-4">
        <div>
          <div class="dropdown dropdown-end">
            <Btn size="md" class="btn-ghost btn-circle" @click="updateRedirectUrl">
              <Icon name="more_vert" />
            </Btn>

            <Menu :items="items" />
          </div>
        </div>
      </div>
    </header>

    <Resource :loading="isLoading" :error="isError">
      <template #loading>
        <div class="w-full h-full flex items-center justify-center">
          <Spinner />
        </div>
      </template>

      <template #error>
        <GenericError :loading="isLoading" @retry="refetch" />
      </template>

      <template #default>
        <div class="bg-white flex flex-1 flex-col items-center p-4">
          <Avatar :name="avatarName" class="mx-auto w-24 h-24 text-2xl bg-slate-300 text-slate-800" />

          <h2 class="text-slate-900 text-center text-2xl mb-1">
            {{ displayName }}
          </h2>
          <Username :username="data?.username!" :show-copy="true" class="mb-2" />

          <div v-if="category" class="text-sm text-slate-600 flex gap-1 items-center">
            <Badge class="bg-transparent border-none flex gap-1 px-0 py-3 text-xs text-slate-600">
              <Icon :name="category?.icon" class="" style="font-size: 1.15rem" />

              {{ category?.name }}
            </Badge>
          </div>

          <p class="text-slate-600 text-xs mt-4">
            {{ data?.persona?.description }}
          </p>
        </div>
      </template>
    </Resource>
  </div>
</template>
