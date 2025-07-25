<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  characterBuildId: number | null
  isEditing: boolean
}>()

const user = useUser()
const localWithDefaultRegion = useLocaleWithDefaultRegion()
const queryClient = useQueryClient()
const toast = useToast()
const { t } = useI18nExperimental()
const toastPaymentRequiredOptions = useToastPaymentRequiredOptions()

const discardMutation = useMutation({
  mutationFn: () => $fetch('/api/character/draft', {
    method: 'DELETE',
    body: {
      characterId: props.characterBuildId || undefined,
    },
    onResponse({ response }) {
      if (response.status === 402) {
        toast.error(
          t('Trial or payment required for this feature.'),
          undefined,
          toastPaymentRequiredOptions(),
        )
      }
    },
  }),
  onError: () => {
    toast.error(t('An error occurred while discarding character.'))
  },
  onSuccess: () => {
    queryClient.resetQueries({
      queryKey: queryKeys.characterDraft(localWithDefaultRegion),
    })

    toast.success(t('Character has been discarded successfully.'))
  },
})

const canManageCharacter = computed(() => canUseAIFeatures(user.value))
</script>

<template>
  <Button
    class="btn btn-xs btn-warning btn-outline"
    icon="material-symbols:cancel-outline-rounded"
    icon-class="text-xl"
    icon-position="right"
    :loading="discardMutation.isPending.value"
    :disabled="!canManageCharacter"
    @click="discardMutation.mutate()"
  >
    {{ t("Discard") }}
  </Button>
</template>
