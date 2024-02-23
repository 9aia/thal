<script setup lang="ts">
import Modal from '#lib/daisy/components/action/Modal.vue'
import Checkbox from '#lib/daisy/components/data-input/Checkbox.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import { useToast } from '#lib/daisy/composables/useToast'
import client from '#lib/hono/client'
import { useI18n } from '#lib/i18n'
import { Cookies } from '#lib/web/utils/cookies'
import { useForm } from 'vee-validate'
import { computed, inject, ref } from 'vue'
import { GOALS } from '../../profile/constants'
import type { Profile } from '../../profile/schemas/profile'
import { parseInitialValues } from '../utils'

const { t } = useI18n()
const toast = useToast()

const profile = inject<Profile>('profile')!

const initialValues = parseInitialValues(profile.goals || '')
const form = useForm<Record<string, boolean | undefined>>({
  initialValues,
})
const keys = computed(() => {
  const values = form.values
  return Object.keys(values)
    .filter(key => values[key])
    .join(', ')
})

const isOpen = defineModel({ default: false })
const loading = ref(false)

const submit = form.handleSubmit(async () => {
  const username = Cookies.get('username')
  if (!username)
    throw new Error(t('Username not found.'))

  const currentKeys = keys.value

  loading.value = true

  const res = await client.app.profile[':username'].$patch({
    param: {
      username,
    },
    json: {
      goals: currentKeys,
    },
  })

  if (!res.ok) {
    toast.error(t('An error occurred while updating goals.'))
  }
  else {
    profile.goals = currentKeys

    toast.success(t('Goals were updated successfully.'))
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
        {{ t("Wry are you learning English?") }}
      </h1>

      <p class="font-gray-600 mb-4">
        {{
          t(
            "Maratongue tailors your learning journey to your unique needs. Tell us what you want to achieve with your English.",
          )
        }}
      </p>

      <div class="h-[200px] px-2 overflow-auto">
        <Checkbox
          v-for="goal in GOALS"
          :key="goal.id"
          :path="goal.id"
          :label="goal.name"
        >
          <Icon>{{ goal.icon }}</Icon>
          {{ goal.name }}
        </Checkbox>
      </div>
    </template>

    <template #footer>
      <div class="w-full mr-2">
        <p class="font-bold mb-4">
          {{ t("Select all that apply.") }}
        </p>
      </div>
    </template>
  </Modal>
</template>
