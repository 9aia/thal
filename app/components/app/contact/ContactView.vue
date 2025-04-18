<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { contactViewUsername, manageContact, rightDrawer, rightDrawers } from '~/store'
import { categories } from '~/constants/discover'
import queryKeys from '~/queryKeys'
import type { MenuItemType } from '~/components/ui/navigation/types'

const contactDeleteModalState = ref(false)
const username = computed(() => contactViewUsername!.value!)

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

const { displayName, hasContact, avatarName, addContact } = useContactInfo(data)
const clearChat = useClearChat(username)
const copyUrl = useCopyUrl()
const copyUsername = useCopyUsername(username)

const items = computed<MenuItemType[]>(() => [
  hasContact.value
    ? {
        id: 'edit-contact',
        name: t('Edit contact'),
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
        name: t('Delete contact'),
        icon: 'delete',
        onClick: () => contactDeleteModalState.value = true,
      }
    : {
        id: 'add-contact',
        name: t('Add to contacts'),
        icon: 'add',
        onClick: () => addContact(),
      },
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'ios_share',
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
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <header class="px-3 flex gap-2 bg-white">
      <h1 class="text-md py-2 text-gray-800 flex items-center gap-1">
        <Button size="md" class="btn-ghost btn-circle" @click="closeDrawer">
          <Icon name="close" />
        </Button>
        {{ t("Character Info") }}
      </h1>

      <div class="flex-1 flex items-center justify-end gap-4">
        <div>
          <div class="dropdown dropdown-end">
            <Button size="md" class="btn-ghost btn-circle">
              <Icon name="more_vert" />
            </Button>

            <Menu :items="items" item-class="py-2" />
          </div>
        </div>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto bg-white divide-y-2 divide-gray-50">
      <Teleport to="body">
        <ContactDeleteModal v-model="contactDeleteModalState" :contact-username="username" />
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
              <Button v-if="!hasContact" size="sm" class="border-none bg-cyan-500 rounded-full text-black  hover:bg-cyan-600 py-2 px-4 flex" @click="addContact">
                <Icon name="person_add" />
                <span class="">{{ t('Save') }}</span>
              </Button>

              <Button size="sm" class="border-none bg-cyan-500 rounded-full text-black  hover:bg-cyan-600 py-2 px-4 flex" @click="copyUrl">
                <Icon name="ios_share" />
                <span class="">{{ t('Share') }}</span>
              </Button>
            </div>
          </section>

          <section class="w-full px-4 py-4 flex flex-col gap-2">
            <MenuItem
              :is="{
                id: 'description',
                name: data?.character?.characterLocalizations[0].description!,
                icon: 'person',
              }"
              class="py-2"
            />
            <MenuItem
              :is="{
                id: 'category',
                name: category?.name!,
                icon: 'category',
              }"
              class="py-2"
            />

            <!-- <div v-if="category" class="text-sm text-gray-600 flex gap-1 items-center">
              <Badge class="bg-transparent border-none flex gap-1 px-0 py-3 text-xs text-gray-600">
                <Icon :name="category?.icon" class="" style="font-size: 1.15rem" />

                {{ category?.name }}
              </Badge>
            </div> -->
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
                icon: 'robot_2',
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
                  size="sm"
                  class="text-blue-500 hover:text-blue-600 flex items-center"
                  @click.stop.prevent="copyUsername"
                >
                  <Icon name="content_copy" style="font-size: 1.15rem" />
                </button>
              </template>
            </Item>
          </section>

          <section class="w-full px-4 py-4 flex flex-col gap-2">
            <Item
              :is="{
                id: 'clear-chat',
                name: t('Clear chat'),
                icon: 'mop',
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
