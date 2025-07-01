<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  characterBuildId: number | null
  isPastDueVisible: boolean
  isEditing: boolean
}>()

const localWithDefaultRegion = useLocaleWithDefaultRegion()
const queryClient = useQueryClient()
const toast = useToast()
const { t } = useI18nExperimental()

const discardMutation = useMutation({
  mutationFn: () => $fetch('/api/character/draft', {
    method: 'DELETE',
    body: {
      characterId: props.characterBuildId || undefined,
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
</script>

<template>
  <Button
    class="btn btn-xs btn-warning btn-outline"
    icon="material-symbols:cancel-outline-rounded"
    icon-class="text-xl"
    icon-position="right"
    :loading="discardMutation.isPending.value"
    :disabled="isPastDueVisible"
    @click="discardMutation.mutate()"
  >
    {{ t("Discard") }}
  </Button>
</template>
