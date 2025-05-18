<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { contactInfoData, manageContact, rightDrawer, rightDrawers } from '~/store'
import { categories } from '~/constants/discover'
import queryKeys from '~/queryKeys'
import type { MenuItemType } from '~/components/ui/navigation/types'

const contactDeleteModalState = ref(false)
const username = computed(() => contactInfoData.value?.username)
const displayName = computed(() => contactInfoData.value?.displayName)
const avatarName = computed(() => contactInfoData.value?.avatarName)

const localeDefaultRegion = useLocaleDefaultRegion()

const {
  data,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: queryKeys.contactInfo(localeDefaultRegion, username),
  queryFn: () => $fetch(`/api/contact-info/${username.value!}`, {
    params: {
      locale: localeDefaultRegion.value,
    },
  }),
  enabled: computed(() => !!username.value),
})

const { t } = useI18nExperimental()

const { hasContact, addContact } = useContactInfo(data)
const clearChat = useClearChat(username)
const copyUrl = useCopyUrl()
const copyUsername = useCopyUsername(username)

const items = computed<MenuItemType[]>(() => [
  hasContact.value
    ? {
        id: 'edit-contact',
        name: t('Edit contact'),
        icon: 'material-symbols:edit-outline',
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
        name: t('Delete contact'),
        icon: 'material-symbols:delete-outline',
        onClick: () => contactDeleteModalState.value = true,
      }
    : {
        id: 'add-contact',
        name: t('Add to contacts'),
        icon: 'material-symbols:add',
        onClick: () => addContact(),
      },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share',
    onClick: () => copyUrl(),
  },
].filter(item => item !== null))

function closeDrawer() {
  rightDrawer.value = false
  rightDrawers.contactView = false
}

const category = computed(() => {
  return categories.find(cat => cat.id === data.value?.character?.categoryId)
})

const date = computed(() => {
  return data.value?.character?.createdAt
    ? [
        new Date(data.value?.character?.createdAt),
        {
          month: 'long',
          year: 'numeric',
        },
      ]
    : undefined
})

function goToChat() {
  navigateTo(`/app/chat/${username.value}`)
  closeDrawer()
}
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <header class="px-3 flex gap-2 bg-white">
      <h1 class="text-md py-2 text-gray-800 flex items-center gap-1">
        <Button size="md" shape="circle" class="btn-ghost" @click="closeDrawer">
          <Icon name="material-symbols:close" />
        </Button>
        {{ t("Character Info") }}
      </h1>

      <div class="flex-1 flex items-center justify-end gap-4">
        <div>
          <div class="dropdown dropdown-end">
            <Button size="md" shape="circle" class="btn-ghost">
              <Icon name="material-symbols:more-vert" />
            </Button>

            <Menu :items="items" item-class="py-2" />
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto bg-white divide-y-2 divide-gray-50">
      <Teleport to="body">
        <ContactDeleteModal
          v-model="contactDeleteModalState"
          :contact-username="username!"
          :character-name="data?.character?.characterLocalizations?.[0].name"
          :character-username="data?.username"
        />
      </Teleport>

      <Resource :loading="isLoading" :error="isError">
        <template #loading>
          <div class="w-full h-full flex items-center justify-center">
            <Spinner class="text-gray-800" />
          </div>
        </template>

        <template #error>
          <ErrorFallback :loading="isLoading" @retry="refetch" />
        </template>

        <template #default>
          <section class="w-full px-4 pb-4 flex flex-col justify-center">
            <Avatar :name="avatarName" class="mx-auto w-24 h-24 text-2xl bg-gray-300 text-gray-800" />

            <h2 class="text-gray-900 text-center text-xl">
              {{ displayName }}
            </h2>

            <Username :username="data?.username!" :show-copy="true" class="mx-auto" />

            <div class="w-full flex justify-center mt-3 gap-2">
              <Button v-if="!hasContact" size="sm" class="border-none bg-blue-500 text-white px-1 py-1 rounded-full hover:bg-blue-500 shadow-none" @click="goToChat">
                <span class="px-4 py-1 flex items-center justify-center gap-1">
                  <Icon name="material-symbols:chat-outline" />
                  {{ t("Message") }}
                </span>
              </Button>

              <Button v-if="!hasContact" size="sm" class="border-none bg-transparent text-orange-500 px-1 py-1 rounded-full hover:bg-orange-500/10 hover:text-orange-500 shadow-none" @click="addContact">
                <span class="px-4 py-1 flex items-center justify-center gap-1">
                  <Icon name="material-symbols:person-add-outline" />
                  {{ t("Save") }}
                </span>
              </Button>

              <Button size="sm" class="border-none bg-transparent text-brown-500 px-1 py-1 rounded-full hover:bg-brown-500/10 hover:text-brown-500 shadow-none" @click="copyUrl">
                <span class="px-4 py-1 flex items-center justify-center gap-1">
                  <Icon name="material-symbols:ios-share" />
                  {{ t('Share') }}
                </span>
              </Button>
            </div>
          </section>

          <section class="w-full px-4 py-4 flex flex-col gap-2">
            <MenuItem
              :is="{
                id: 'description',
                name: data?.character?.characterLocalizations[0].description!,
                icon: 'material-symbols:person-outline',
              }"
              class="py-2"
            />
            <MenuItem
              :is="{
                id: 'category',
                name: category?.name!,
                icon: 'material-symbols:category-outline',
              }"
              class="py-2"
            />
          </section>

          <section v-if="date" class="w-full px-4 py-4">
            <p class="text-gray-800 text-sm">
              {{ t('Created at {date}', { date }) }}
            </p>
          </section>

          <section class="w-full px-4 py-4">
            <MenuItem
              :is="{
                id: 'ai-character',
                name: t('AI Character'),
                icon: 'material-symbols:robot-2-outline',
                description: t('This character leverages AI to simulate responses.'),
                meaning: 'info',
              }"
              class="py-2"
            />
          </section>

          <section v-if="date" class="w-full px-4 py-4">
            <Item
              :is="{
                id: 'ai-character',
                name: `@${username}`,
                description: t('Username'),
                onClick: () => copyUsername(),
              }"
            >
              <template #title>
                <button
                  class="text-blue-500 hover:text-blue-600 flex items-center"
                  @click.stop.prevent="copyUsername"
                >
                  <Icon name="material-symbols:content-copy-outline" class="text-xl" />
                </button>
              </template>
            </Item>
          </section>

          <section class="w-full px-4 py-4 flex flex-col gap-2">
            <Item
              :is="{
                id: 'clear-chat',
                name: t('Clear chat'),
                icon: 'material-symbols:mop-outline',
                meaning: 'danger',
                onClick: () => clearChat(),
              }"
            />
          </section>
        </template>
      </Resource>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-badge {

  background: radial-gradient(at bottom, theme('colors.blue.100'), theme('colors.gray.50'));
}

.bg-gradient-badge-2 {
  background: radial-gradient(at bottom, theme('colors.blue.100'), theme('colors.gray.100'));
}
</style>
