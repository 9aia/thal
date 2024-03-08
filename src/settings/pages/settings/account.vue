<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { User } from 'lucia'
import { useForm } from 'vee-validate'
import { ref, toValue, watch } from 'vue'
import { useI18n } from '~/lib/psitta/vue'
import useHasFormErrors from '~/src/base/composables/useHasFormErrors'
import { nameSchema, pronounsSchema, usernameSchema } from '~/src/base/server/db/schema'
import yupify from '~/src/base/utils/yupify'
import Btn from '~/src/ui/components/action/Btn.vue'
import TextField from '~/src/ui/components/data-input/TextField.vue'
import Icon from '~/src/ui/components/display/Icon.vue'
import { useToast } from '~/src/ui/composables/useToast'

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
  if (!username) { return }

  const currentUsername = user.username

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
  } else {
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

const submit = form.handleSubmit(async () => {
  const username = user.username

  loading.value = true

  const res = await client.app.profile[':username'].$patch({
    param: {
      username: username as string,
    },
    json: form.values,
  })

  if (!res.ok) {
    toast.error(t('An error occurred while updating personal data.'))
  } else {
    Object.keys(form.values).forEach((key) => {
      // @ts-expect-error
      const value = form.values[key]
      // @ts-expect-error
      user[key] = value
    })

    toast.success(t('Personal data has been updated successfully.'))
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
