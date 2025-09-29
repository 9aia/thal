<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import queryKeys from '~/queryKeys'
import { manageContactName, manageContactUsername } from '~/store'
import type { Contact } from '~~/shared/types'
import yupify from '~/utils/yupify'
import { nameSchema, nameSchemaChecks, usernameSchema, usernameSchemaChecks } from '~~/server/db/schema'

const { t } = useI18nExperimental()
const toast = useToast()
const queryClient = useQueryClient()
const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)

const contactQuery = useContactQuery(manageContactUsername)

const form = useForm<{ name: string, username: string }>({
  initialValues: {
    name: manageContactName.value ?? contactQuery.data.value?.name ?? '',
    username: manageContactUsername.value ?? '',
  },
})
const hasErrors = useHasFormErrors(form)

watch([manageContactName, manageContactUsername], () => {
  form.setValues({
    name: manageContactName.value ?? contactQuery.data.value?.name ?? '',
    username: manageContactUsername.value ?? '',
  })
})

const characterQuery = useCharacterQuery(toRef(form.values, 'username'))

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

const hasFormChanged = computed(() => {
  return form.values.name !== contactQuery.data.value?.name
})

function handleGoToChat(username: string) {
  sidebar.open.value = false

  navigateTo(`/app/chat/${username}`)
  toast.close()
}

const createMutation = useMutation({
  mutationFn: () => $fetch(`/api/contact`, {
    method: 'POST',
    body: form.values,
  }),
  onError: () => toast.error(t('An error occurred while creating contact.')),
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
  onError: () => toast.error(t('An error occurred while editing contact.')),
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
            :disabled="hasErrors || (isEditing && !hasFormChanged)"
          >
            {{ t('Save contact') }}
          </Button>
        </form>
      </SettingSection>
    </div>
  </div>
</template>
