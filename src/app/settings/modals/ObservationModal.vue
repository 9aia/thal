<script setup lang="ts">
import { useForm } from 'vee-validate'
import { inject, ref } from 'vue'
import { MAX_OBSERVATION_CHARS } from '../../profile/constants'
import type { Profile } from '../../profile/schemas/profile'
import Modal from '#lib/daisy/components/action/Modal.vue'
import Textarea from '#lib/daisy/components/data-input/Textarea.vue'
import { useToast } from '#lib/daisy/composables/useToast'
import client from '#lib/hono/client'
import { useI18n } from '#lib/i18n'
import { Cookies } from '#lib/web/utils/cookies'

const { t } = useI18n()
const toast = useToast()

const profile = inject<Profile>('profile')!

const form = useForm<{
  observation: Profile['observation']
}>({
  initialValues: {
    observation: profile.observation,
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
    toast.error(t('An error occurred while updating your observation.'))
  }
  else {
    profile.observation = data.observation

    toast.success(t('Observation has been updated successfully.'))
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
        {{ t("What else would like to share with AI?") }}
      </h1>

      <div class="px-2 pb-2 space-y-2 overflow-y-auto mt-4">
        <Textarea
          class="resize-none"
          path="observation"
          :label="t('Your observation')"
          :rules="
            (v) =>
              v?.length <= MAX_OBSERVATION_CHARS
              || t(`It must contain at most ${MAX_OBSERVATION_CHARS} characters`)
          "
          :feedback="true"
        >
          <template #feedback>
            <span
              :class="{
                'text-red-500':
                  (form.values.observation?.length || 0) > MAX_OBSERVATION_CHARS,
              }"
            >
              {{ form.values.observation?.length || 0 }}/{{
                MAX_OBSERVATION_CHARS
              }}
              characters
            </span>
          </template>
        </Textarea>
      </div>
    </template>
  </Modal>
</template>
