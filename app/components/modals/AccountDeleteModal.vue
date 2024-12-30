<script setup lang="ts">
import { useFieldError, useFieldValue, useForm } from "vee-validate"
import { T, useI18n } from "@psitta/vue"

const { t } = useI18n()

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
    return t("Username is required")

  return inputValue === user.value!.username || t("Username does not match")
}

const isFieldError = useFieldError("username")
const inputValue = useFieldValue("username")

const isUsernameInvalid = computed(() => {
  return !(!isFieldError.value && !!inputValue.value)
})
</script>

<template>
  <form ref="formDeleteUserRef" action="/api/user/delete" method="POST" aria-hidden class="hidden" />

  <Modal v-model="isOpen">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("Are you sure?") }}
      </h1>

      <div role="alert" class="flex items-center gap-2 bg-transparent">
        <Icon class="text-warning">
          warning
        </Icon>

        <T
          text="This action {cannot} be undone. This will permanently delete your profile, stats and progress."
          :values="{ cannot: 'cannot' }"
        >
          <template #cannot="slotProps">
            <span class="font-bold">
              {{ slotProps.cannot }} {{ ' ' }}
            </span>
          </template>
        </T>
      </div>

      <p class="mb-4 mt-4 text-slate-800" />

      <p class="mb-2 text-slate-800">
        <T text="To confirm, please insert {username} below:" :values="{ username: user!.username }">
          <template #username="slotProps">
            <span class="text-warning font-bold">
              {{ slotProps.username }} {{ ' ' }}
            </span>
          </template>
        </T>
      </p>

      <TextField label="Username" path="username" :rules="checkUsernameRule" />
    </template>

    <template #actions>
      <Btn value="true" class="btn-error" :disabled="isUsernameInvalid" @click.prevent="submit">
        {{ t('Delete my account') }}
      </Btn>

      <Btn value="false" class="btn btn-primary" @click="isOpen = false">
        {{ t('Cancel') }}
      </Btn>
    </template>
  </Modal>
</template>
