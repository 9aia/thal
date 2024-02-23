<script setup lang="ts">
import { useForm } from 'vee-validate'
import { inject, ref, toValue, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import Btn from '#lib/daisy/components/action/Btn.vue'
import { useToast } from '#lib/daisy/composables/useToast'
import client from '#lib/hono/client'
import { t } from '#lib/i18n'
import type {
  Profile,
} from '~/app/profile/schemas/profile'
import {
  nameSchema,
  pronounsSchema,
  usernameSchema,
} from '~/app/profile/schemas/profile'
import { Cookies } from '#lib/web/utils/cookies'
import TextField from '#lib/daisy/components/data-input/TextField.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import useHasFormErrors from '#lib/vee-validate/composables/useHasFormErrors'
import yupify from '#lib/vee-validate/utils/yupify'

const ERROR_MESSAGE = t('An error occurred while updating personal data.')
const SUCCESS_MESSAGE = t('Personal data has been updated successfully.')
const USERNAME_NOT_FOUND_MESSAGE = t('Username not found.')
const USERNAME_INVALID_MESSAGE = t('Username is invalid.')
const USERNAME_VALIDATION_ERROR_MESSAGE = t(
  'An error occurred while validating username.',
)

const profile = inject<Profile>('profile')!
const toast = useToast()
const form = useForm<Profile>({
  initialValues: toValue(profile),
})
const hasErrors = useHasFormErrors(form)

const loading = ref(false)

const invalidUsername = ref(false)

async function validateUsername(username: string) {
  if (!username)
    return

  const currentUsername = Cookies.get('username')

  const res = await client.app.profile.validateUsername[':username'].$get({
    param: {
      username,
    },
  })

  let invalid = false

  if (!res.ok) {
    toast.error(USERNAME_VALIDATION_ERROR_MESSAGE)
    invalid = false
  }
  else {
    const result = await res.json()
    invalid = !result.valid && currentUsername !== username
  }

  invalidUsername.value = invalid

  form.setFieldError(
    'username',
    invalid ? USERNAME_INVALID_MESSAGE : undefined,
  )
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const submit = form.handleSubmit(async (data) => {
  const username = Cookies.get('username')
  if (!username)
    throw new Error(USERNAME_NOT_FOUND_MESSAGE)

  if (username !== data.username)
    Cookies.set('username', data.username, { path: '/' })

  loading.value = true

  const res = await client.app.profile[':username'].$patch({
    param: {
      username: username as string,
    },
    json: form.values,
  })

  if (!res.ok) {
    toast.error(ERROR_MESSAGE)
  }
  else {
    Object.keys(form.values).forEach((key) => {
      // @ts-expect-error
      const value = form.values[key]
      // @ts-expect-error
      profile[key] = value
    })

    toast.success(SUCCESS_MESSAGE)
  }

  loading.value = false
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
        path="lastName"
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
      :rules="
        (v) => usernameSchema.safeParse(v).success || USERNAME_INVALID_MESSAGE
      "
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
        'Pronouns must contain between 1 and 20 characters.',
      ))"
    />

    <div class="h-2" />

    <Btn :loading="loading" class="btn-primary" :disabled="hasErrors">
      {{
        t("Save")
      }}
    </Btn>
  </form>
</template>
