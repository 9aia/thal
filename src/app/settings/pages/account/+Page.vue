<script setup lang="ts">
import { useForm } from 'vee-validate'
import { inject, ref, toValue, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import Btn from '#lib/daisy/components/action/Btn.vue'
import { useToast } from '#lib/daisy/composables/useToast'
import client from '#lib/hono/client'
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
import { useI18n } from '#lib/i18n'

const { t } = useI18n()
const toast = useToast()

const profile = inject<Profile>('profile')!
const form = useForm<Profile>({
  initialValues: toValue(profile),
})
const hasErrors = useHasFormErrors(form)
const invalidUsername = ref(false)
const loading = ref(false)

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
    toast.error(t(
      'An error occurred while validating username.',
    ))
    invalid = false
  }
  else {
    const result = await res.json()
    invalid = !result.valid && currentUsername !== username
  }

  invalidUsername.value = invalid

  form.setFieldError(
    'username',
    invalid ? t('Username is invalid.') : undefined,
  )
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const submit = form.handleSubmit(async (data) => {
  const username = Cookies.get('username')
  if (!username)
    throw new Error(t('Username not found.'))

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
    toast.error(t('An error occurred while updating personal data.'))
  }
  else {
    Object.keys(form.values).forEach((key) => {
      // @ts-expect-error
      const value = form.values[key]
      // @ts-expect-error
      profile[key] = value
    })

    toast.success(t('Personal data has been updated successfully.'))
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
