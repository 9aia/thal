<script setup lang="ts">
import { useAsyncState } from '@vueuse/core';
import { useFieldError, useForm } from 'vee-validate';
import { useI18n } from '~/lib/psitta/vue'

const { t } = useI18n()

const formDeleteUserRef = ref<HTMLFormElement>()

const { handleSubmit } = useForm()
const user = useUser()

const submit = handleSubmit(async () => {
  if(!formDeleteUserRef.value) {
    return
  }

  formDeleteUserRef.value.submit()
})

const isOpen = defineModel({ default: false })

const checkUsernameRule = (inputValue: string) => {
  if (!inputValue) return t('Username is required')

  return inputValue === user.value!.username || t('Username does not match')
}

const isFieldError = useFieldError('username')

const isUsernameInvalid = ref(true)

watch(isFieldError, (value) => {
  isUsernameInvalid.value = !!value
})
</script>

<template>
  <form
    ref="formDeleteUserRef"
    action="/api/user-delete"
    method="POST"
    aria-hidden
    class="hidden"
  />

  <Modal v-model="isOpen">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("You are about to delete your account.") }}
      </h1>

      <p class="mb-4">
        {{ t("This action is irreversible. You progress will be lost.") }}
      </p>
      
      <p class="mb-4">
        {{ t("To confirm, please insert you username below:") }}
      </p>

      <TextField
        label="Username"
        path="username"
        :rules="checkUsernameRule"
      />
    </template>

    <template #actions>
      <Btn
        value="true"
        class="btn-error"
        :disabled="isUsernameInvalid"
        @click.prevent="submit"
      >
        {{ t('Delete account') }}
      </Btn>

      <Btn
        value="false"
        class="btn btn-primary"
        @click="isOpen = false"
      >
        {{ t('Cancel') }}
      </Btn>
    </template>
  </Modal>
</template>
