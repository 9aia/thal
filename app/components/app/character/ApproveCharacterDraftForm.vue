<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { characterBuildId, contactViewUsername, isRootDrawerOpen } from '~/store'
import { CONFLICT_STATUS_CODE } from '~/utils/web'

const props = defineProps<{
  shouldShowDiscard: boolean
  discoverable?: boolean
  username: string
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'approved'): void
}>()

interface FormValues {
  discoverable: boolean
}

const initialValues = ref<FormValues>({
  discoverable: props.discoverable ?? false,
})

const { t } = useI18nExperimental()
const form = useForm<FormValues>({
  initialValues: initialValues.value,
})

watch(initialValues, () => form.setValues(initialValues.value))

const toast = useToast()
const user = useUser()
const { params } = useRoute()
const queryClient = useQueryClient()
const localWithDefaultRegion = useLocaleDefaultRegion()

function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false

  navigateTo(`/app/chat/${username}`)
  toast.close()
}

const approveMutation = useMutation({
  mutationFn: (values: FormValues) => $fetch('/api/character/draft/approve', {
    method: 'POST',
    body: {
      discoverable: values.discoverable,
      characterId: characterBuildId.value == null ? undefined : characterBuildId.value,
    },
  }),
  onSuccess: (data) => {
    queryClient.resetQueries({
      queryKey: queryKeys.characterDraft,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.myCharacters,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.discoverCharacters,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.discoverCharactersSearch(localWithDefaultRegion.value, '', undefined),
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.character(localWithDefaultRegion.value, data.username),
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.characterDraftEdit(localWithDefaultRegion.value, characterBuildId.value),
    })

    // refresh chat route and contact info view if open
    const usernameQuery = params.username

    if (props.username === usernameQuery)
      navigateTo(`/app/chat/${data.username}`)

    if (props.username === contactViewUsername.value)
      contactViewUsername.value = data.username

    toast.success(t('Character has been approved successfully.'), undefined, {
      actions: [
        {
          title: t('Message'),
          onClick: () => handleGoToChat(data.username),
        },
      ],
    })

    emit('approved')
  },
  onError: (error) => {
    const e = error as FetchError

    if (e.statusCode === CONFLICT_STATUS_CODE) {
      toast.error(t('That username\'s taken — tweak your prompt or suggest one directly.'))
      return
    }

    toast.error(t('An error occurred while approving character.'))
  },
})

const discardMutation = useMutation({
  mutationFn: () => $fetch('/api/character/draft', {
    method: 'DELETE',
    body: {
      characterId: characterBuildId.value,
    },
  }),
  onSuccess: () => {
    queryClient.resetQueries({
      queryKey: queryKeys.characterDraft,
    })

    toast.success(t('Character has been discarded successfully.'))
  },
})

const submit = form.handleSubmit(values => approveMutation.mutate(values))

const isPastDueVisible = computed(() => {
  if (!user.value) {
    return false
  }

  return isPlanPastDue(user.value)
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <Checkbox path="discoverable" input-class="checkbox-primary" :disabled="isPastDueVisible">
      {{
        t('Discoverable')
      }}
    </Checkbox>

    <div class="flex items-center space-x-2">
      <Button
        type="submit"
        size="xs"
        class="border-none bg-primary text-black px-1 py-1 rounded-full hover:bg-cyan-600 shadow-none"
        icon="material-symbols:order-approve-outline"
        :loading="approveMutation.isPending.value"
        :disabled="isPastDueVisible"
      >
        <template #label>
          {{ isEditing ? t("Approve edition") : t("Approve character") }}
        </template>
      </Button>

      <Button
        v-if="shouldShowDiscard"
        size="xs"
        type="button"
        class="border-none bg-transparent text-orange-500 px-1 py-1 rounded-full hover:bg-orange-500/10 hover:text-orange-500 shadow-none"
        icon="material-symbols:cancel-outline"
        :loading="discardMutation.isPending.value"
        :disabled="isPastDueVisible"
        @click="discardMutation.mutate()"
      >
        <template #label>
          {{ isEditing ? t("Discard edition") : t("Discard character") }}
        </template>
      </Button>
    </div>
  </form>
</template>
