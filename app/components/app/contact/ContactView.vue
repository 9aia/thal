<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import type { MenuItemType } from '~/components/ui/navigation/types'
import { categories } from '~/constants/discover'
import queryKeys from '~/queryKeys'
import { closeContactView, manageContact, manageContactUsername } from '~/store'

const { t } = useI18nExperimental()
const localeDefaultRegion = useLocaleDefaultRegion()
const copyUrl = useCopyUrl()
const toast = useToast()

const contactDeleteModalState = ref(false)

const username = computed(() => manageContactUsername.value!)
const copyUsername = useCopyUsername(username)
const clearChat = useClearChat(username)

const contactQuery = useQuery({
  queryKey: queryKeys.contact(username),
  queryFn: () => $fetch(`/api/contact/${manageContactUsername.value!}`),
  enabled: computed(() => !!manageContactUsername.value),
})

watch(contactQuery.error, (error) => {
  if (error) {
    toast.error(t('Error fetching contact'))
  }
})

const characterQuery = useQuery({
  queryKey: queryKeys.character(localeDefaultRegion, username),
  queryFn: () => $fetch(`/api/character/${username.value!}?locale=${localeDefaultRegion.value}` as `/api/character/:username`),
  enabled: computed(() => !!manageContactUsername.value),
})

watch(characterQuery.error, (error) => {
  if (error) {
    toast.error(t('Error fetching character'))
  }
})

const isLoading = computed(() => contactQuery.isLoading.value || characterQuery.isLoading.value)
const isError = computed(() => !!contactQuery.error.value || !!characterQuery.error.value)

function refetch() {
  if (contactQuery.error.value) {
    contactQuery.refetch()
  }

  if (characterQuery.error.value) {
    characterQuery.refetch()
  }
}

const hasContact = computed(() => !!contactQuery.data.value)
const contactNames = computed(() => getContactName({
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
  username: username.value,
}))

const categoryName = computed(() => {
  const category = categories.find(cat => cat.id === characterQuery.data.value?.categoryId)
  return category?.name
})

const createdAt = computed(() => {
  return characterQuery.data.value?.createdAt
    ? [
        new Date(characterQuery.data.value?.createdAt),
        {
          month: 'long',
          year: 'numeric',
        },
      ]
    : undefined
})

const items = computed<MenuItemType[]>(() => [
  hasContact.value
    ? {
        id: 'edit-contact',
        name: t('Edit contact'),
        icon: 'material-symbols:edit-outline',
        onClick: () => manageContact(username.value),
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
        onClick: () => manageContact(username.value, characterQuery.data.value?.name),
      },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share',
    onClick: () => copyUrl(),
  },
].filter(item => item !== null))

function goToChat() {
  navigateTo(`/app/chat/${username.value}`)
  closeContactView()
}
</script>

<template>
  <div class="flex flex-col sm:max-w-md h-dvh justify-between">
    <header class="px-3 flex gap-2 bg-white">
      <h1 class="text-md py-2 text-gray-800 flex items-center gap-1">
        <Button size="md" shape="circle" class="btn-ghost" @click="closeContactView">
          <Icon name="material-symbols:close" />
        </Button>
        {{ t("Contact Info") }}
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
            <Avatar :name="contactNames.avatarName" class="mx-auto w-24 h-24 text-2xl bg-gray-300 text-gray-800" />

            <h2 class="text-gray-900 text-center text-xl">
              {{ contactNames.displayName }}
            </h2>

            <Username :username="username" :show-copy="true" class="mx-auto" />

            <div class="w-full flex justify-center mt-3 gap-2">
              <Button
                v-if="!hasContact"
                size="sm"
                class="border-none bg-blue-500 text-white px-1 py-1 rounded-full hover:bg-blue-500 shadow-none"
                @click="goToChat"
              >
                <span class="px-4 py-1 flex items-center justify-center gap-1">
                  <Icon name="material-symbols:chat-outline" />
                  {{ t("Message") }}
                </span>
              </Button>

              <Button
                v-if="!hasContact"
                size="sm"
                class="border-none bg-transparent text-orange-500 px-1 py-1 rounded-full hover:bg-orange-500/10 hover:text-orange-500 shadow-none"
                @click="manageContact(username, contactNames.displayName)"
              >
                <span class="px-4 py-1 flex items-center justify-center gap-1">
                  <Icon name="material-symbols:person-add-outline" />
                  {{ t("Save") }}
                </span>
              </Button>

              <Button
                size="sm"
                class="border-none bg-transparent text-brown-500 px-1 py-1 rounded-full hover:bg-brown-500/10 hover:text-brown-500 shadow-none"
                @click="copyUrl"
              >
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
                name: characterQuery.data.value?.description ?? '',
                icon: 'material-symbols:person-outline',
              }"
              class="py-2"
            />

            <MenuItem
              :is="{
                id: 'category',
                name: categoryName,
                icon: 'material-symbols:category-outline',
              }"
              v-if="categoryName"
              class="py-2"
            />
          </section>

          <section v-if="createdAt" class="w-full px-4 py-4">
            <p class="text-gray-800 text-sm">
              {{ t('Created at {createdAt}', { createdAt }) }}
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

          <section v-if="createdAt" class="w-full px-4 py-4">
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

    <Teleport to="body">
      <ContactDeleteModal
        v-model="contactDeleteModalState"
        :contact-username="username!"
        :contact-name="contactQuery.data.value?.name"
      />
    </Teleport>
  </div>
</template>

<style scoped>
.bg-gradient-badge {

  background: radial-gradient(at bottom, var(--color-blue-100), var(--color-gray-50));
}

.bg-gradient-badge-2 {
  background: radial-gradient(at bottom, var(--color-blue-100), var(--color-gray-100));
}
</style>
