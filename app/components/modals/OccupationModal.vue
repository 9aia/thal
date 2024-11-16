<script setup lang="ts">
import { useForm } from "vee-validate"
import { useI18n } from "@psitta/vue"
import type { User } from "~~/db/schema"
import { useQueryClient } from "@tanstack/vue-query"
import { useToast } from "~~/layers/ui/composables/useToast"
import { MAX_PROFESSION_CHARS } from "~/constants/base"
import queryKeys from "~/queryKeys"

const { t } = useI18n()
const toast = useToast()
const user = useUser()

const queryClient = useQueryClient()

const form = useForm<{
  profession: User["profession"]
}>({
  initialValues: {
    profession: user.value!.profession,
  },
})

const isOpen = defineModel({ default: false })
const loading = ref(false)

const submit = form.handleSubmit(async () => {
  const data = form.values
  const username = user.value!.username

  loading.value = true

  try {
    await $fetch(`/api/profile/${username}`, {
      method: "patch",
      body: {
        profession: data.profession,
      },
    })

    user.value = { ...user.value!, profession: data.profession }

    toast.success(t("Occupation has been updated successfully."))

    queryClient.invalidateQueries({
      queryKey: queryKeys.profile(user.value!.username),
    })
  }
  catch (e) {
    toast.error(t("An error occurred while updating your occupation."))
  }

  loading.value = false
  isOpen.value = false
})
</script>

<template>
  <Modal v-model="isOpen" :confirm-text="t('Save')" :loading="loading" @confirm="submit">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("What do you do for work?") }}
      </h1>

      <p class="text-md text-gray-500">
        {{ t("Tell us what you do (or aspire to do). Example: Teacher.") }}
      </p>

      <div class="px-2 pb-2 space-y-2 overflow-y-auto mt-4">
        <TextField
          path="profession" :label="t('Your occupation')"
          :rules="(v: any) =>
            v?.length <= MAX_PROFESSION_CHARS || t('It must contain at most {maxChars} characters', { maxChars: MAX_PROFESSION_CHARS })" :feedback="true"
        >
          <template #feedback>
            <span
              :class="{
                'text-red-500':
                  (form.values.profession?.length || 0) > MAX_PROFESSION_CHARS,
              }"
            >
              {{ form.values.profession?.length || 0 }}/{{ MAX_PROFESSION_CHARS }}
              characters
            </span>
          </template>
        </TextField>
      </div>

      <p class="text-sm text-gray-600">
        {{
          t("P.S. Don't have a traditional job? No worries! Share your life's calling - writer, musician, world traveler - anything goes!",
          )
        }}
      </p>
    </template>
  </Modal>
</template>
