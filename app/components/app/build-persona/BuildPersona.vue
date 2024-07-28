<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import { useDebounceFn } from "@vueuse/core"
import type { User } from "lucia"
import { useForm } from "vee-validate"
import { descriptionSchema, instructionsSchema, nameSchema, usernameSchema } from "~~/db/schema"
import { useToast } from "~~/layers/ui/composables/useToast"

const emit = defineEmits<{
  (e: "close"): void
}>()
const { t } = useI18n()
const toast = useToast()

const form = useForm<User>()
const hasErrors = useHasFormErrors(form)
const invalidUsername = ref(false)
const loading = ref(false)

async function validateUsername(username: string) {
  if (!username)
    return

  let invalid = false

  try {
    const { valid } = await $fetch(`/api/persona/validate-username/${username}`)

    invalid = !valid
  }
  catch (e) {
    toast.error(t(
      "An error occurred while validating username.",
    ))
    invalid = false
  }

  invalidUsername.value = invalid

  form.setFieldError(
    "username",
    invalid ? t("Username is invalid.") : undefined,
  )
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const submit = form.handleSubmit(async (data) => {
  loading.value = true

  try {
    await $fetch(`/api/persona`, {
      method: "post",
      body: {
        ...data,
        conversationStarters: [],
      },
    })

    toast.success(t("Persona has been created successfully."))

    emit("close")

    form.resetForm()
  }
  catch (e) {
    toast.error(t("An error occurred while creating persona."))
  }

  loading.value = false
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Btn size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Btn>
        {{ t("Build Persona") }}
      </h1>
    </Navbar>

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <SettingSection :title="t('General Information')">
        <form class="block space-y-2" @submit="submit">
          <TextField
            path="name" :label="t('Name')" :rules="yupify(nameSchema, t(
              'Name must contain between 1 and 20 characters.',
            ))"
          />
          <TextField
            path="username" :label="t('Username')" :rules="yupify(usernameSchema, t('Username is invalid.'))"
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
            path="description" :label="t('Description')" :rules="yupify(descriptionSchema, t(
              'Description must contain between 1 and 100 characters.',
            ))"
          />

          <Textarea
            path="instructions" :label="t('Instructions')" :rules="yupify(instructionsSchema, t(
              'Instructions must contain between 1 and 500 characters.',
            ))"
          />

          <div class="h-2" />

          <Btn :loading="loading" class="btn-primary" :disabled="hasErrors">
            {{
              t("Save")
            }}
          </Btn>
        </form>
      </SettingSection>
    </div>
  </div>
</template>
