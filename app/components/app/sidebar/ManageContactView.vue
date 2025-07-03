<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import type { Contact } from '~/types'
import yupify from '~/utils/yupify'
import { nameSchema, nameSchemaChecks, usernameSchema, usernameSchemaChecks } from '~~/db/schema'

const { t } = useI18nExperimental()
const toast = useToast()
const queryClient = useQueryClient()
const localeDefaultRegion = useLocaleWithDefaultRegion()
const sidebar = useSidebar()

const contactQuery = useServerQuery({
  queryKey: queryKeys.contact(computed(() => manageContactUsername.value!)),
  queryFn: () => $fetch(`/api/contact/${manageContactUsername.value!}` as `/api/contact/:username`),
  enabled: computed(() => !!manageContactUsername.value),
})

const form = useForm<{ name: string, username: string }>({
  initialValues: {
    name: manageContactName.value ?? contactQuery.data.value?.name ?? '',
    username: manageContactUsername.value ?? '',
  },
})
const hasErrors = useHasFormErrors(form)

const characterQuery = useServerQuery({
  queryKey: queryKeys.character(localeDefaultRegion, toRef(() => form.values.username)),
  queryFn: () => $fetch(`/api/character/${form.values.username}` as `/api/character/:username`, {
    params: { locale: localeDefaultRegion.value },
  }),
  enabled: computed(() => !!form.values.username),
})

async function validateUsername(suggestedUsername: string) {
  if (!suggestedUsername || suggestedUsername === manageContactUsername.value)
    return

  try {
    const {
      alreadyAdded,
      isUsernameValid,
      characterNotFound,
    } = await $fetch(`/api/contact/validate-username/${suggestedUsername}`)

    if (!isUsernameValid) {
      form.setErrors({ username: t('Username is invalid.') })
    }
    else if (characterNotFound) {
      form.setErrors({ username: t('Character not found.') })
    }
    else if (alreadyAdded) {
      form.setErrors({ username: t('Contact already added.') })
    }
  }
  catch (e) {
    console.error(e)
    toast.error(t('An error occurred while validating username.'))
  }
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const isEditing = computed(() => !!contactQuery.data.value?.id)

function handleGoToChat(username: string) {
  sidebar.open.value = false

  navigateTo(`/app/chat/${username}`)
  toast.close()
}

function onError() {
  const message = isEditing.value
    ? t('An error occurred while editing contact.')
    : t('An error occurred while creating contact.')

  return toast.error(message)
}

const createMutation = useMutation({
  mutationFn: () => $fetch(`/api/contact`, {
    method: 'POST',
    body: form.values,
  }),
  onError,
  onSuccess: (data) => {
    const contactsItem = {
      username: data.username,
      contactId: data.id,
      contactName: data.name,
      characterDescription: characterQuery.data.value?.description ?? '',
    }

    queryClient.setQueryData<Contact[]>(
      queryKeys.contacts,
      oldData => [...(oldData ?? []), contactsItem],
    )

    queryClient.setQueryData(
      queryKeys.contact(data.username),
      data,
    )

    toast.success(
      t('{name} was added to your contacts.', { name: data.name }),
      5000,
      {
        actions: [
          { title: t('Message'), onClick: () => handleGoToChat(data.username) },
        ],
        position: 'start-bottom',
      },
    )
  },
})

const editMutation = useMutation({
  mutationFn: () => $fetch(`/api/contact/${manageContactUsername.value}`, {
    method: 'PATCH',
    body: form.values,
  }),
  onError,
  onSuccess: (data) => {
    const contactsItem = {
      username: data.username,
      contactId: data.id,
      contactName: data.name,
      characterDescription: characterQuery.data.value?.description ?? '',
    }

    queryClient.setQueryData<Contact[]>(
      queryKeys.contacts,
      oldData => oldData?.map(item => item.username === data.username ? contactsItem : item) ?? [],
    )

    queryClient.setQueryData(
      queryKeys.contact(data.username),
      data,
    )

    toast.success(
      t('{name} was edited.', { name: data.name }),
      5000,
      {
        actions: [
          { title: t('Message'), onClick: () => handleGoToChat(data.username) },
        ],
        position: 'start-bottom',
      },
    )
  },
})

const isLoading = computed(() => createMutation.isPending.value || editMutation.isPending.value)

const submit = form.handleSubmit(() => isEditing.value
  ? editMutation.mutate()
  : createMutation.mutate(),
)
</script>

<template>
  <div class="flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      :title="isEditing ? t('Edit Contact') : t('New Contact')"
      @back="sidebar.back()"
    />

    <div
      class="pt-2 flex-1 overflow-y-auto bg-white space-y-4"
    >
      <SettingSection
        :title="t('General Information')"
        title-class="px-6"
        body-class="px-4"
      >
        <form class="px-2 block space-y-2" @submit="submit">
          <TextField
            input-class="input-lg input-primary w-full"
            autofocus
            path="name"
            :label="t('Name')"
            :placeholder="t('John Doe')"
            :rules="yupify(nameSchema, t(
              `Name must contain between {min} and {max} characters.`,
              nameSchemaChecks,
            ))"
          />
          <TextField
            v-if="!isEditing"
            class="w-full"
            input-class="input-lg input-primary w-full"
            path="username"
            :label="t('Username')"
            :placeholder="t('john_doe')"
            autocapitalize="none"
            autocomplete="off"
            :rules="yupify(usernameSchema, t(
              'Username can only contain letters, numbers, and underscores. Min {min} character, max {max} characters.',
              usernameSchemaChecks,
            ))"
            icon-position="right"
          >
            <template #icon="{ errorMessage }">
              <Icon
                :class="{ 'text-error': errorMessage, 'text-success': !errorMessage }"
                :name="errorMessage ? 'material-symbols:close-rounded' : 'material-symbols:check-rounded'"
              />
            </template>
          </TextField>

          <Button
            :loading="isLoading"
            class="btn btn-primary float-right mt-2"
            icon="material-symbols:person-add-outline-rounded"
            :disabled="hasErrors"
          >
            {{ t('Save contact') }}
          </Button>
        </form>
      </SettingSection>
    </div>
  </div>
</template>
