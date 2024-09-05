<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import { useQueryClient } from "@tanstack/vue-query"
import { useDebounceFn } from "@vueuse/core"
import { useForm } from "vee-validate"
import { contactData } from "~/store"
import { nameSchema, usernameSchema } from "~~/db/schema"
import { useToast } from "~~/layers/ui/composables/useToast"

const emit = defineEmits<{
  (e: "close"): void
}>()
const { t } = useI18n()
const toast = useToast()

const queryClient = useQueryClient()

const form = useForm<{ name: string, username: string }>({
  initialValues: contactData.value,
})
const hasErrors = useHasFormErrors(form)
const loading = ref(false)

watch(contactData, () => {
  if (contactData.value)
    form.setValues(contactData.value)
  else
    form.resetForm()
})

async function validateUsername(username: string) {
  if (!username)
    return

  try {
    const {
      alreadyAdded,
      isUsernameValid,
      personaNotFound,
    } = await $fetch(`/api/contact/validate-username/${username}`)

    if (alreadyAdded) {
      form.setErrors({
        username: t("Contact already added."),
      })
    }

    if (!isUsernameValid) {
      form.setErrors({
        username: t("Username is invalid."),
      })
    }

    if (personaNotFound) {
      form.setErrors({
        username: t("Persona not found."),
      })
    }
  }
  catch (e) {
    toast.error(t(
      "An error occurred while validating username.",
    ))
  }
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const submit = form.handleSubmit(async (data) => {
  loading.value = true

  try {
    await $fetch(`/api/contact`, {
      method: "post",
      body: {
        ...data,
      },
    })

    toast.success(t("Contact has been created successfully."))

    emit("close")

    queryClient.invalidateQueries({
      queryKey: ["contacts"],
    })

    queryClient.invalidateQueries({
      queryKey: ["chat", data.username],
    })

    form.resetForm()
  }
  catch (e) {
    toast.error(t("An error occurred while creating contact."))
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
        {{ t("New Contact") }}
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
