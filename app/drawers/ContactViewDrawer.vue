<script setup lang="ts">
import type { MenuItemType } from '~/components/ui/navigation/types'
import { categories } from '~/constants/discover'
import queryKeys from '~/queryKeys'
import { closeContactView, contactViewUsername, manageContact } from '~/store'

const { t } = useI18nExperimental()
const localeDefaultRegion = useLocaleDefaultRegion()
const toast = useToast()
const copyUrl = useCopyUrl()

const contactDeleteModalState = ref(false)

const username = computed(() => contactViewUsername.value!)
const copyUsername = useCopyUsername(username)
const clearChat = useClearChat(username)

const historyQuery = useServerQuery({
  queryKey: queryKeys.chatHistory(username),
  queryFn: () => $fetch(`/api/chat/history/${username.value!}` as `/api/chat/history/:username`),
  enabled: computed(() => !!username.value),
})
const hasMessages = computed(() => !!historyQuery.data.value?.length)

const contactQuery = useServerQuery({
  queryKey: queryKeys.contact(username),
  queryFn: () => $fetch(`/api/contact/${contactViewUsername.value!}` as `/api/contact/:username`),
  enabled: computed(() => !!contactViewUsername.value),
})

watch(contactQuery.error, (error) => {
  if (error)
    toast.error(t('Error fetching contact'))
})

const isContact = computed(() => !!contactQuery.data.value?.id)

const characterQuery = useServerQuery({
  queryKey: queryKeys.character(localeDefaultRegion, username),
  queryFn: () => $fetch(`/api/character/${username.value!}` as `/api/character/:username`, {
    query: {
      locale: localeDefaultRegion.value,
    },
  }),
  enabled: computed(() => !!contactViewUsername.value),
})

watch(characterQuery.error, (error) => {
  if (error)
    toast.error(t('Error fetching character'))
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

const isLoading = computed(() => contactQuery.isLoading.value || characterQuery.isLoading.value)
const isError = computed(() => !!contactQuery.error.value || !!characterQuery.error.value)

function refetch() {
  if (contactQuery.error.value)
    contactQuery.refetch()
  if (characterQuery.error.value)
    characterQuery.refetch()
}

const contactNames = computed(() => getContactName({
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
  username: username.value,
}))

const categoryName = computed(() => {
  const category = categories.find(cat => cat.id === characterQuery.data.value?.categoryId)
  return category?.name
})

function goToChat() {
  navigateTo(`/app/chat/${username.value}`)
  closeContactView()
  toast.close()
}

function saveContact() {
  manageContact(username.value, contactNames.value.displayName)
  closeContactView()
  toast.close()
}

const items = computed<MenuItemType[]>(() => [
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
  {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share-rounded',
    onClick: () => copyUrl(),
  },
].filter(item => item !== null))
</script>

<template>
  <div class="flex flex-col w-full sm:w-sm h-dvh justify-between">
    <header class="px-4 pt-4 flex gap-2 bg-white">
      <h1 class="text-sm text-black flex items-center gap-1 -translate-x-1.5">
        <Button
          class="btn btn-neutral btn-circle btn-ghost"

          icon="material-symbols:close-rounded"
          @click="closeContactView"
        />

        {{ t("Contact Info") }}
      </h1>

      <div class="flex-1 flex items-center justify-end gap-1 translate-x-1.5 z-50">
        <Dropdown class="dropdown-end">
          <Button
            class="btn btn-neutral btn-circle btn-ghost"

            icon="material-symbols:more-vert"
          />

          <DropdownContent :items="items" />
        </Dropdown>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto bg-white">
      <CommonResource
        :for="{
          data: contactQuery.data.value,
          isLoading,
          isError,
          refetch,
        }"
      >
        <section class="w-full px-6 pb-4 mt-2 flex flex-col justify-center">
          <ContactViewIdentifier
            :username="username"
            :avatar-name="contactNames.avatarName"
            :display-name="contactNames.displayName"
            actions-class="gap-8"
          >
            <template #actions>
              <LabeledIconButton
                v-if="!isContact"
                icon="material-symbols:chat-outline-rounded"
                :label="t('Message')"
                @click="goToChat()"
              />

              <LabeledIconButton
                v-if="!isContact"
                icon="material-symbols:person-add-outline-rounded"
                :label="t('Save')"
                @click="saveContact()"
              />

              <LabeledIconButton
                icon="material-symbols:ios-share-rounded"
                :label="t('Share')"
                @click="copyUrl"
              />
            </template>
          </ContactViewIdentifier>
        </section>

        <section class="w-full px-6">
          <MenuItem
            :is="{
              id: 'ai-character',
              icon: 'material-symbols:robot-2-outline-rounded',
              description: t('Messages are generated by AI.'),
            }"
          />
        </section>

        <section class="w-full px-6 py-4 flex flex-col gap-2">
          <MenuItem
            :is="{
              id: 'description',
              name: characterQuery.data.value?.description ?? '',
              icon: 'material-symbols:person-outline-rounded',
            }"
            class="py-2"
          />

          <MenuItem
            :is="{
              id: 'category',
              name: categoryName,
              icon: 'material-symbols:category-outline-rounded',
            }"
            v-if="categoryName"
            class="py-2"
          />

          <MenuItem
            :is="{
              id: 'created-at',
              name: t('Created at {createdAt}', { createdAt }),
              icon: 'material-symbols:calendar-month-outline-rounded',
            }"
          />
        </section>

        <section v-if="createdAt" class="px-4 py-2 w-full">
          <Item
            :is="{
              id: 'ai-character',
              name: `@${username}`,
              description: t('Username'),
              onClick: () => copyUsername(),
            }"
            class="px-2 py-2 rounded-2xl focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          >
            <template #title>
              <div
                class="text-blue-500 hover:text-blue-600 flex items-center cursor-pointer"
              >
                <Icon name="material-symbols:content-copy-outline-rounded" class="text-xl" />
              </div>
            </template>
          </Item>
        </section>

        <section class="px-4 py-2 w-full flex flex-col gap-2">
          <Item
            :is="{
              id: 'clear-chat',
              name: t('Clear chat'),
              icon: 'material-symbols:mop-outline',
              meaning: 'danger',
              onClick: () => clearChat(),
            }"
            v-if="hasMessages"
            class="px-2 py-2 rounded-2xl focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
          />
        </section>
      </CommonResource>
    </div>

    <ContactDeleteModal
      v-if="isContact"
      v-model="contactDeleteModalState"
      :contact-username="username"
      :contact-name="contactQuery.data.value?.name!"
    />
  </div>
</template>
