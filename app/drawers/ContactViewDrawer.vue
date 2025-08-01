<script setup lang="ts">
import type { MenuItemType, MenuItemTypeOrFalse } from '~/components/ui/navigation/types'
import { categories } from '~/constants/discover'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import { buildCharacter, closeContactView, contactViewUsername, manageContact } from '~/store'

const { t } = useI18nExperimental()
const toast = useToast()
const copyText = useClipboard()
const user = useUser()
const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)

const contactDeleteModalState = ref(false)
const chatClearModalState = ref()

const username = computed(() => contactViewUsername.value!)
const copyUsername = useCopyUsername(username)

const historyQuery = useHistoryQuery(username)
const contactQuery = useContactQuery(username)
const characterQuery = useCharacterQuery(username)

const queryPromises = [
  contactQuery.suspense(),
  characterQuery.suspense(),
  historyQuery.suspense(),
]

await Promise.all(queryPromises)

const hasMessages = computed(() => !!historyQuery.data.value?.length)
const isContact = computed(() => !!contactQuery.data.value?.id)
const isCharacterDeleted = computed(() => !characterQuery.data.value?.id)
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

watch(contactQuery.error, (error) => {
  if (error)
    toast.error(t('Error fetching contact'))
})

watch(characterQuery.error, (error) => {
  if (error)
    toast.error(t('Error fetching character'))
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
const isCharacterFromLoggedUser = computed(() => {
  return characterQuery.data.value?.creatorId === user.value?.id
})

function goToChat() {
  navigateTo(`/app/chat/${username.value}`)
  closeContactView()
}

function saveContact() {
  manageContact(username.value, contactNames.value.displayName)
  sidebar.push('manage-contact')
  closeContactView()
}

function editContact() {
  manageContact(username.value)
  sidebar.push('manage-contact')
  closeContactView()
}

function editCharacter() {
  buildCharacter(characterQuery.data.value?.id)
  sidebar.push('build-character')
  closeContactView()
}

function copyShareCharacterUrl() {
  const url = window.location.origin
  const usernameUrl = `${url}/app/chat/${username.value}`

  copyText(usernameUrl)
}

const items = computed(() => ([
  isCharacterFromLoggedUser.value && {
    id: 'edit-character',
    name: t('Edit character'),
    icon: 'material-symbols:frame-person-outline-rounded',
    onClick: () => editCharacter(),
  },
  !isCharacterDeleted.value && {
    id: 'share-character',
    name: t('Share character'),
    icon: 'material-symbols:ios-share-rounded',
    onClick: () => copyShareCharacterUrl(),
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
        onClick: () => saveContact(),
      },
] satisfies MenuItemTypeOrFalse[]).filter(Boolean) as MenuItemType[])
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
        common-error-fallback-class="px-6 mt-4"
      >
        <section class="w-full px-6 pb-4 mt-2 flex flex-col justify-center items-center">
          <ContactViewIdentifier
            :username="username"
            :avatar-name="contactNames.avatarName"
            :display-name="contactNames.displayName"
            actions-class="gap-8 px-4"
          >
            <template #actions>
              <LabeledIconButton
                v-if="!isCharacterDeleted"
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
                v-if="isCharacterFromLoggedUser"
                icon="material-symbols:frame-person-outline-rounded"
                :label="t('Edit')"
                @click="editCharacter()"
              />

              <LabeledIconButton
                v-if="!isCharacterDeleted"
                icon="material-symbols:ios-share-rounded"
                :label="t('Share')"
                @click="copyShareCharacterUrl()"
              />
            </template>
          </ContactViewIdentifier>
        </section>

        <section class="w-full px-6 flex flex-col gap-2">
          <MenuItem
            :is="{
              id: 'is-character-deleted',
              name: t('Character deleted.'),
              description: t('This character has been deleted.'),
              meaning: 'warning',
              icon: 'material-symbols:warning-outline-rounded',
            }"
            v-if="isCharacterDeleted"
          />

          <MenuItem
            :is="{
              id: 'ai-character',
              icon: 'material-symbols:robot-2-outline-rounded',
              description: t('This is A.I. and not a real person. Treat everything it says as fiction. What is said should not be relied upon as fact or advice.'),
            }"
          />
        </section>

        <section class="w-full px-6 py-4 flex flex-col gap-2">
          <MenuItem
            :is="{
              id: 'description',
              name: characterQuery.data.value?.description,
              icon: 'material-symbols:person-outline-rounded',
            }"
            v-if="characterQuery.data.value?.description"
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
            v-if="createdAt"
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
              onClick: () => chatClearModalState = true,
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

    <LazyHistoryClearModal
      v-if="hasMessages"
      v-model="chatClearModalState"
      :username="username"
    />
  </div>
</template>
