<script setup lang="ts">
import { useFieldError, useFieldValue, useForm } from 'vee-validate'
import { T, useI18n } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Persona } from '~/types'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  persona?: Persona
}>()

const { t } = useI18n()
const queryClient = useQueryClient()

const isOpen = defineModel({ default: false })

const { handleSubmit, resetForm } = useForm()

const {
  mutate,
} = useMutation({
  mutationFn: async () => {
    return $fetch(`/api/persona/${props.persona?.username}` as '/api/persona/:username', {
      method: 'DELETE',
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.myPersonas,
    })
    queryClient.invalidateQueries({
      queryKey: ['discover-personas'],
    })

    isOpen.value = false
  },
})

const submit = handleSubmit(async () => {
  mutate()
})

watch(isOpen, () => {
  if (!isOpen.value)
    return

  resetForm()
})

function checkUsernameRule(inputValue: string) {
  if (!inputValue)
    return t('Username is required')

  return inputValue === props.persona?.username || t('Username does not match')
}

const isFieldError = useFieldError('username')
const inputValue = useFieldValue('username')

const isUsernameInvalid = computed(() => {
  return !(!isFieldError.value && !!inputValue.value)
})
</script>

<template>
  <Modal v-model="isOpen">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4 text-gray-900">
        {{ t("Are you sure?") }}
      </h1>

      <div role="alert" class="flex items-center gap-2 bg-transparent">
        <Icon class="text-warning">
          warning
        </Icon>

        <T
          text="This action {cannot} be undone. This will permanently delete the character."
          :values="{ cannot: 'cannot' }"
        >
          <template #cannot="slotProps">
            <span class="font-bold">
              {{ slotProps.cannot }} {{ ' ' }}
            </span>
          </template>
        </T>
      </div>

      <p class="mb-4 mt-4 text-gray-800" />

      <p class="mb-2 text-gray-800">
        <T text="To confirm, please insert {username} below:" :values="{ username: true }">
          <template #username>
            <span class="text-warning font-bold">
              {{ persona?.username }} {{ ' ' }}
            </span>
          </template>
        </T>
      </p>

      <TextField
        label="Username"
        path="username"
        autocapitalize="none"
        autocomplete="off"
        :rules="checkUsernameRule"
      />
    </template>

    <template #actions>
      <Button value="true" class="btn-error" :disabled="isUsernameInvalid" @click.prevent="submit">
        {{ t('Delete character') }}
      </Button>

      <Button value="false" class="btn btn-primary" @click="isOpen = false">
        {{ t('Cancel') }}
      </Button>
    </template>
  </Modal>
</template>
