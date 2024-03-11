<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { User } from 'lucia'
import { useForm } from 'vee-validate'
import { useI18n } from '~/lib/psitta/vue'
import { nameSchema, pronounsSchema, usernameSchema } from '~/src/base/server/db/schema'

const { t } = useI18n()
const toast = useToast()

const user = useUser()
const form = useForm<User>({
  initialValues: toValue(user),
})
const hasErrors = useHasFormErrors(form)
const invalidUsername = ref(false)
const loading = ref(false)

async function validateUsername (username: string) {
  if (!username) {
    return
  }

  const currentUsername = user.value!.username

  let invalid = false

  try {
    const { valid } = await $fetch(`/api/validate-username/${username}` as '/api/validate-username/:username')
  
    invalid = !valid && currentUsername !== username
  } catch (e) {
    toast.error(t(
      'An error occurred while validating username.',
    ))
    invalid = false
  }

  invalidUsername.value = invalid
  
  form.setFieldError(
    'username',
    invalid ? t('Username is invalid.') : undefined,
  )
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

watch(form.values, () => {
  console.log(console.log(form.values))
})

const submit = form.handleSubmit(async (data) => {
  const username = user.value!.username

  loading.value = true

  try {
    await $fetch(`/api/profile/${username}` as "/api/profile/:id", {
      method: "patch",
      body: data,
    })

    const updatedUser = { ...user.value!, ...data }

    user.value = updatedUser 

    toast.success(t('Personal data has been updated successfully.'))
  } catch (e) {
    toast.error(t('An error occurred while updating personal data.'))
  }

  loading.value = false
})

definePageMeta({
  middleware: 'premium',
  layout: 'setting',
})
</script>

<template>
  <h1 class="text-4xl font-bold mb-4">
    {{ t("Account Settings") }}
  </h1>

  <form class="block space-y-2" @submit="submit">
    <div class="gap-2 grid grid-cols-2">
      <TextField
        path="name"
        :label="t('Name')"
        class="grid-cols-1/2"
        :rules="yupify(nameSchema, t(
          'Name must contain between 1 and 20 characters.',
        ))"
      />
      <TextField
        path="last_name"
        :label="t('Last name')"
        class="grid-cols-1/2"
        :rules="yupify(nameSchema, t(
          'Last name must contain between 1 and 20 characters.',
        ))"
      />
    </div>
    <TextField
      path="username"
      :label="t('Username')"
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
    <TextField
      path="pronouns"
      :label="t('Pronouns')"
      :rules="yupify(pronounsSchema, t(
        'Pronouns must be up to 20 characters long.',
      ))"
    />

    <div class="h-2" />

    <Btn :loading="loading" class="btn-primary" :disabled="hasErrors">
      {{
        t("Save")
      }}
    </Btn>
  </form>

  <ul class="mt-6">
    <li class="flex gap-2">
      <Icon class="text-green-800">check</Icon>
        
      {{ t('Signed in with Google') }}
    </li>
  </ul>
</template>
