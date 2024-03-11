<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useI18n } from '~/lib/psitta/vue'
import { GOALS } from '~/src/base/constants'
import { parseInitialValues } from '../utils'

const { t } = useI18n()
const toast = useToast()
const user = useUser()

const initialValues = parseInitialValues(user.goals || '')
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
  const username = user.value!.username
  const currentKeys = keys.value

  loading.value = true

  try {
    await $fetch(`/api/profile/${username}` as "/api/profile/:id", {
      method: "patch",
      body: {
        goals: currentKeys,
      },
      ignoreResponseError: false,
    })

    user.value = { ...user.value!, goals: currentKeys }

    toast.success(t('Goals were updated successfully.'))
  } catch (e) {
    toast.error(t('An error occurred while updating your goals.'))
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
