<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { isRootDrawerOpen, manageContactUsername } from '~/store'
import { nameSchema, usernameSchema } from '~~/db/schema'
import queryKeys from '~/queryKeys'
import type { Contact } from '~/types'

const emit = defineEmits<{
  (e: 'close'): void
}>()

useAutoRedirect({
  query: { drawer: ['save'] },
})

const { t } = useI18nExperimental()
const toast = useToast()
const queryClient = useQueryClient()

const form = useForm<Contact>({})
const hasErrors = useHasFormErrors(form)

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
    const _ = e
    toast.error(t('An error occurred while validating username.'))
  }
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const contactQuery = useQuery({
  queryKey: queryKeys.contact(computed(() => manageContactUsername.value!)),
  queryFn: () => $fetch(`/api/contact/${manageContactUsername.value!}` as `/api/contact/:username`),
  enabled: computed(() => !!manageContactUsername.value),
})

const isEditing = computed(() => !!manageContactUsername.value)

function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false

  navigateTo(`/app/chat/${username}`)
  toast.close()
}

function onError() {
  const message = isEditing.value
    ? t('An error occurred while editing contact.')
    : t('An error occurred while creating contact.')

  return toast.error(message)
}

function onSuccess(data: any) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.contacts,
  })

  queryClient.setQueryData(
    queryKeys.contact(manageContactUsername.value!),
    data,
  )

  const message = isEditing.value
    ? t('{name} was edited.', { name: data.name })
    : t('{name} was added to your contacts.', { name: data.name })
  const username = data.username

  toast.success(message, 5000, {
    actions: [
      {
        title: t('Message'),
        onClick: () => handleGoToChat(username),
      },
    ],
    position: 'start-bottom',
  })

  form.resetForm()
  emit('close')
  // TODO: change manage contact to edition mode
}

const createMutation = useMutation({
  mutationFn: () => $fetch(`/api/contact`, {
    method: 'POST',
    body: form.values,
  }),
  onSuccess,
  onError,
})

const editMutation = useMutation({
  mutationFn: () => $fetch(`/api/contact/${manageContactUsername.value}`, {
    method: 'PATCH',
    body: form.values,
  }),
  onSuccess,
  onError,
})

const loading = computed(() => createMutation.isPending.value || editMutation.isPending.value)

const submit = form.handleSubmit(() => isEditing.value
  ? editMutation.mutate()
  : createMutation.mutate(),
)

const minNameLength = nameSchema._def.checks.find(check => check.kind === 'min')?.value
const maxNameLength = nameSchema._def.checks.find(check => check.kind === 'max')?.value
const minUsernameLength = usernameSchema._def.checks.find(check => check.kind === 'min')?.value
const maxUsernameLength = usernameSchema._def.checks.find(check => check.kind === 'max')?.value
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="isEditing ? t('Edit Contact') : t('New Contact')" @close="emit('close')" />

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <SettingSection :title="t('General Information')">
        <form class="block space-y-2" @submit="submit">
          <TextField
            autofocus
            path="name"
            :label="t('Name')"
            :rules="yupify(nameSchema, t(
              `Name must contain between {min} and {max} characters.`, {
                min: minNameLength,
                max: maxNameLength,
              },
            ))"
          />
          <TextField
            v-if="!isEditing"
            path="username"
            :label="t('Username')"
            autocapitalize="none"
            autocomplete="off"
            :rules="yupify(usernameSchema, t(
              'Username can only contain letters, numbers, and underscores. Min {min} character, max {max} characters.', {
                min: minUsernameLength,
                max: maxUsernameLength,
              },
            ))"
            icon-position="right"
          >
            <template #icon="{ errorMessage }">
              <Icon
                :class="{ 'text-error': errorMessage, 'text-success': !errorMessage }"
                :name="errorMessage ? 'material-symbols:close' : 'material-symbols:check'"
              />
            </template>
          </TextField>

          <div class="h-2" />

          <Button :loading="loading" class="btn-primary rounded-full px-4" :disabled="hasErrors">
            {{
              t("Save")
            }}
          </Button>
        </form>
      </SettingSection>
    </div>
  </div>
</template>
