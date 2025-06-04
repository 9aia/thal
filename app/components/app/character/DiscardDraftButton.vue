<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  characterBuildId: number | null
  isPastDueVisible: boolean
  isEditing: boolean
}>()

const localWithDefaultRegion = useLocaleDefaultRegion()
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
    icon-size="md"
    icon="material-symbols:cancel-outline-rounded"
    icon-position="right"
    :loading="discardMutation.isPending.value"
    :disabled="isPastDueVisible"
    @click="discardMutation.mutate()"
  >
    {{ isEditing ? t("Discard edition") : t("Discard character") }}
  </Button>
</template>
