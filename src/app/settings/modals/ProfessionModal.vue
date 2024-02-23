<script setup lang="ts">
import { useForm } from 'vee-validate'
import { inject, ref } from 'vue'
import { MAX_PROFESSION_CHARS } from '../../profile/constants'
import type { Profile } from '../../profile/schemas/profile'
import Modal from '#lib/daisy/components/action/Modal.vue'
import TextField from '#lib/daisy/components/data-input/TextField.vue'
import { useToast } from '#lib/daisy/composables/useToast'
import client from '#lib/hono/client'
import { useI18n } from '#lib/i18n'
import { Cookies } from '#lib/web/utils/cookies'

const { t } = useI18n()
const toast = useToast()

const profile = inject<Profile>('profile')!
const form = useForm<{
  profession: Profile['profession']
}>({
  initialValues: {
    profession: profile.profession,
  },
})

const isOpen = defineModel({ default: false })
const loading = ref(false)

const submit = form.handleSubmit(async (data) => {
  const username = Cookies.get('username')
  if (!username)
    throw new Error(t('Username not found.'))

  loading.value = true

  const res = await client.app.profile[':username'].$patch({
    param: {
      username,
    },
    json: form.values,
  })

  if (!res.ok) {
    toast.error(t('An error occurred while updating your profession.'))
  }
  else {
    profile.profession = data.profession

    toast.success(t('Profession has been updated successfully.'))
  }

  loading.value = false
  isOpen.value = false
})
</script>

<template>
  <Modal
    v-model="isOpen"
    :confirm-text="t('Save')"
    :loading="loading"
    @confirm="submit"
  >
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("What do you do for work?") }}
      </h1>

      <p class="text-md text-gray-500">
        {{ t("Tell us what you do (or aspire to do). Example: Teacher.") }}
      </p>

      <div class="px-2 pb-2 space-y-2 overflow-y-auto mt-4">
        <TextField
          path="profession"
          :label="t('Your profession')"
          :rules="
            (v) =>
              v.length <= MAX_PROFESSION_CHARS || t(`It must contain at most ${MAX_PROFESSION_CHARS} characters`)
          "
          :feedback="true"
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
          t(
            "P.S. Don't have a traditional job? No worries! Share your life's calling - writer, musician, world traveler - anything goes!",
          )
        }}
      </p>
    </template>
  </Modal>
</template>
