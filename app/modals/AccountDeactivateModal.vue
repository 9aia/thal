<script setup lang="ts">
import { useFieldError, useFieldValue, useForm } from 'vee-validate'
import { T } from '@psitta/vue'

const { t } = useI18nExperimental()

const formDeleteUserRef = ref<HTMLFormElement>()

const { handleSubmit } = useForm()
const user = useUser()

const submit = handleSubmit(async () => {
  if (!formDeleteUserRef.value)
    return

  formDeleteUserRef.value.submit()
})

const isOpen = defineModel({ default: false })

function checkUsernameRule(inputValue: string) {
  if (!inputValue)
    return t('Username is required')

  return inputValue === user.value?.username || t('Username does not match')
}

const isFieldError = useFieldError('username')
const inputValue = useFieldValue('username')

const isUsernameInvalid = computed(() => {
  return !(!isFieldError.value && !!inputValue.value)
})
</script>

<template>
  <form
    ref="formDeleteUserRef"
    action="/api/user/deactivate"
    method="POST"
    aria-hidden
    class="hidden"
    @submit.prevent="submit"
  />

  <Modal
    v-model="isOpen"
    no-scroll
    :title="t('Deactivate Account')"
  >
    <template #default>
      <div role="alert" class="px-8 flex items-center gap-3 bg-transparent">
        <Icon class="text-warning">
          material-symbols:warning-outline
        </Icon>

        <T
          text="This action will {hide} your account and all associated data. You can reactivate it anytime."
          :values="{ hide: 'hide' }"
        >
          <template #hide="slotProps">
            <span class="font-bold">
              {{ slotProps.hide }} {{ ' ' }}
            </span>
          </template>
        </T>
      </div>

      <p class="px-8 mb-4 mt-4 text-gray-800" />

      <p class="px-8 mb-2 text-gray-800">
        <T text="To confirm, please insert {username} below:" :values="{ username: user?.username }">
          <template #username="slotProps">
            <span class="text-warning font-bold">
              {{ slotProps.username }} {{ ' ' }}
            </span>
          </template>
        </T>
      </p>

      <TextField
        class="px-8"
        input-class="input-lg input-primary w-full"
        autocapitalize="none"
        autocomplete="off"
        label="Username"
        path="username"
        :rules="checkUsernameRule"
      />
    </template>

    <template #actions>
      <Button class="btn btn-error" value="true" :disabled="isUsernameInvalid" @click.prevent="submit">
        {{ t('Deactivate my account') }}
      </Button>

      <Button class="btn btn-primary" value="false" @click="isOpen = false">
        {{ t('Cancel') }}
      </Button>
    </template>
  </Modal>
</template>
