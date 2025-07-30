<script setup lang="ts">
import { T } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useFieldError, useFieldValue, useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { chatListSearch } from '~/store'

const props = defineProps<{
  characterUsername: string
}>()

const emit = defineEmits<{
  (e: 'delete'): void
}>()

const isOpen = defineModel({ default: false })

const { t } = useI18nExperimental()
const toast = useToast()
const queryClient = useQueryClient()
const { params } = useRoute()
const localeWithDefaultRegion = useLocaleWithDefaultRegion()

const { handleSubmit, resetForm } = useForm()

const deleteCharacterMutation = useMutation({
  mutationFn: async () => {
    return $fetch(`/api/character/${props.characterUsername}` as '/api/character/:username', {
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

    const username = props.characterUsername

    queryClient.invalidateQueries({
      queryKey: queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value),
    })

    if (params?.username === username)
      navigateTo('/app/discover')

    isOpen.value = false

    toast.success(t('Character deleted'))

    emit('delete')
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

  return inputValue === props.characterUsername || t('Username does not match')
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
      <div role="alert" class="px-8 flex flex-col items-center gap-3 bg-transparent">
        <Icon class="text-error text-4xl" name="material-symbols:warning-outline-rounded" />

        <T
          text="This will delete the character. Its username will become available for a new character, and it will no longer be discoverable within the app. While your and other users' existing conversations with them will remain, sending, receiving, or translating messages with this deleted character will no longer be possible to function."
          :values="{ cannot: 'cannot' }"
          class="text-error"
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
              {{ characterUsername }} {{ ' ' }}
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
