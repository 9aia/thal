<script setup lang="ts">
import { useFieldError, useFieldValue, useForm } from 'vee-validate'
import { T } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Character } from '~/types'
import queryKeys from '~/queryKeys'
import { chatListSearch } from '~/store'

const props = defineProps<{
  character?: Character
}>()

const { t } = useI18nExperimental()
const toast = useToast()
const queryClient = useQueryClient()

const isOpen = defineModel({ default: false })

const { handleSubmit, resetForm } = useForm()

const { params } = useRoute()
const localeWithDefaultRegion = useLocaleWithDefaultRegion()

const deleteCharacterMutation = useMutation({
  mutationFn: async () => {
    return $fetch(`/api/character/${props.character?.usernames?.text}` as '/api/character/:username', {
      method: 'DELETE',
    })
  },
  onError: () => {
    toast.error(t('An error occurred while deleting character.'))
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.myCharacters,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.discoverCharacters(localeWithDefaultRegion.value),
    })

    const username = props.character!.usernames!.text

    queryClient.invalidateQueries({
      queryKey: queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value),
    })

    if (params?.username === username)
      navigateTo('/app/discover')

    isOpen.value = false
  },
})

const submit = handleSubmit(async () => {
  deleteCharacterMutation.mutate()
})

watch(isOpen, () => {
  if (!isOpen.value)
    return

  resetForm()
})

function checkUsernameRule(inputValue: string) {
  if (!inputValue)
    return t('Username is required')

  return inputValue === props.character?.usernames?.text || t('Username does not match')
}

const isFieldError = useFieldError('username')
const inputValue = useFieldValue('username')

const isUsernameInvalid = computed(() => {
  return !(!isFieldError.value && !!inputValue.value)
})
</script>

<template>
  <Modal
    v-model="isOpen"
    :title="t('Are you sure?')"
    show-close-button
    no-scroll
  >
    <template #default>
      <div role="alert" class="px-8 flex items-center gap-3 bg-transparent">
        <Icon class="text-warning" name="material-symbols:warning-outline-rounded" />

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

      <p class="px-8 mb-4 mt-4 text-gray-800" />

      <p class="px-8 mb-2 text-gray-800">
        <T text="To confirm, please insert {username} below:" :values="{ username: true }">
          <template #username>
            <span class="text-warning font-bold">
              {{ character?.usernames?.text }} {{ ' ' }}
            </span>
          </template>
        </T>
      </p>

      <TextField
        class="px-8"
        input-class="input-lg input-primary w-full"
        label="Username"
        path="username"
        autocapitalize="none"
        autocomplete="off"
        :rules="checkUsernameRule"
      />
    </template>

    <template #actions>
      <Button
        class="btn btn-error"
        value="true"
        :disabled="isUsernameInvalid"
        :loading="deleteCharacterMutation.isPending.value"
        @click.prevent="submit"
      >
        {{ t('Delete character') }}
      </Button>

      <Button
        class="btn btn-primary"
        value="false"
        :disabled="deleteCharacterMutation.isPending.value"
        @click="isOpen = false"
      >
        {{ t('Cancel') }}
      </Button>
    </template>
  </Modal>
</template>
