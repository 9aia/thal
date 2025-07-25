<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { characterBuildId, contactViewUsername } from '~/store'
import { CONFLICT_STATUS_CODE } from '~/utils/web'

const props = defineProps<{
  discoverable?: boolean
  previousUsername?: string
  hasChanges?: boolean
}>()

const emit = defineEmits<{
  (e: 'approved', characterId: number): void
}>()

interface FormValues {
  discoverable: boolean
}

const initialValues = ref<FormValues>({
  discoverable: props.discoverable ?? true,
})

const { t } = useI18nExperimental()
const form = useForm<FormValues>({
  initialValues: initialValues.value,
})

watch(initialValues, () => form.setValues(initialValues.value))

const toast = useToast()
const user = useUser()
const route = useRoute()
const router = useRouter()
const queryClient = useQueryClient()
const localWithDefaultRegion = useLocaleWithDefaultRegion()

const approveMutation = useMutation({
  mutationFn: (values: FormValues) => $fetch('/api/character/draft/approve', {
    method: 'POST',
    body: {
      discoverable: values.discoverable,
      characterId: characterBuildId.value == null ? undefined : characterBuildId.value,
    },
    onResponse({ response }) {
      if (response.status === 402) {
        throw toast.error(
          t('Trial or payment required for this feature.'),
          undefined,
          toastPaymentRequiredOptions({}),
        )
      }
    },
  }),
  onError: (error) => {
    const e = error as FetchError

    if (e.statusCode === CONFLICT_STATUS_CODE) {
      toast.error(t('That username\'s taken — tweak your prompt or suggest one directly.'))
      return
    }

    toast.error(t('An error occurred while approving character.'))
  },
  onSuccess: (data) => {
    // TODO: optimize invalidations (use queryClient.setQueryData)
    queryClient.resetQueries({
      queryKey: queryKeys.characterDraft(localWithDefaultRegion),
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.myCharacters,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.discoverCharacters(localWithDefaultRegion.value),
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

    // refresh chat route and contact info view if they are open
    if (route.path === `/app/chat/${props.previousUsername}`) {
      router.replace({
        hash: route.hash,
        query: route.query,
        path: `/app/chat/${data.username}`,
        replace: true,
      })
    }

    if (props.previousUsername === contactViewUsername.value)
      contactViewUsername.value = data.username

    toast.success(t('Character has been approved successfully.'))

    emit('approved', data.characterId)
  },
})

const submit = form.handleSubmit(values => approveMutation.mutate(values))

const canManageCharacter = computed(() => canUseAIFeatures(user.value))

const hasDiscoverableChanges = computed(() => {
  return form.values.discoverable !== props.discoverable
})
</script>

<template>
  <form class="flex justify-between items-center space-y-4 p-2 flex-wrap gap-2" @submit.prevent="submit">
    <CheckboxField
      path="discoverable"
      input-class="checkbox-primary"
      class="mb-0"
      :disabled="!canManageCharacter"
      :label="t('Discoverable')"
    />

    <div class="flex items-center space-x-2">
      <Button
        v-show="hasChanges || hasDiscoverableChanges"
        type="submit"
        class="btn btn-sm btn-primary"
        icon="material-symbols:order-approve-outline-rounded"
        icon-class="text-xl"
        icon-position="right"
        :loading="approveMutation.isPending.value"
        :disabled="!canManageCharacter"
      >
        {{ t("Approve") }}
      </Button>
    </div>
  </form>
</template>
