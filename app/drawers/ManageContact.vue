<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { contactData, drawers, isRootDrawerOpen } from '~/store'
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
const { mainField } = useNewContactFocus()

watch(() => contactData.value, () => {
  if (contactData.value) {
    form.setValues(contactData.value)
  }
  else {
    form.resetForm()
  }
}, { immediate: true })

watch(() => drawers.manageContact, (value) => {
  if (!value) {
    form.resetForm()
  }
}, { immediate: true })

async function validateUsername(username: string) {
  if (!username || username === contactData.value?.username)
    return

  try {
    const {
      alreadyAdded,
      isUsernameValid,
      characterNotFound,
    } = await $fetch(`/api/contact/validate-username/${username}`)

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

const isEditing = computed(() => !!contactData.value?.id)

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

function onSuccess(data: typeof form.values) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.contacts,
  })

  queryClient.invalidateQueries({
    queryKey: queryKeys.chat(contactData.value?.id || data.username),
  })

  queryClient.invalidateQueries({
    queryKey: queryKeys.contactInfo(contactData.value?.id || data.username),
  })

  queryClient.invalidateQueries({
    queryKey: queryKeys.chats,
  })

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
}

const createMutation = useMutation({
  mutationFn: () => $fetch(`/api/contact`, {
    method: 'post',
    body: form.values,
  }),
  onSuccess: () => onSuccess(form.values),
  onError,
})

const editMutation = useMutation({
  mutationFn: () => $fetch(`/api/contact/${contactData.value!.id}`, {
    method: 'PATCH',
    body: form.values,
  }),
  onSuccess: () => onSuccess(form.values),
  onError,
})

const loading = computed(() => createMutation.isPending.value || editMutation.isPending.value)

const submit = form.handleSubmit(() => isEditing.value
  ? editMutation.mutate()
  : createMutation.mutate(),
)
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="isEditing ? t('Edit Contact') : t('New Contact')" @close="emit('close')" />

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <SettingSection :title="t('General Information')">
        <form class="block space-y-2" @submit="submit">
          <TextField
            ref="mainField" path="name" :label="t('Name')" :rules="yupify(nameSchema, t(
              'Name must contain between 1 and 20 characters.',
            ))"
          />
          <TextField
            v-if="!isEditing"
            path="username"
            :label="t('Username')"
            autocapitalize="none"
            autocomplete="off"
            :rules="yupify(usernameSchema, t('Username is invalid.'))"
            icon-position="right"
          >
            <template #icon="{ errorMessage }">
              <Icon
                :class="{ 'text-error': errorMessage, 'text-success': !errorMessage }"
                :name="errorMessage ? 'close' : 'check'"
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
