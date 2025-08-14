<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import type { History, MessageCorrectionData } from '~/types'

const props = defineProps<{
  message: string
  messageId: number
  messageCorrection?: MessageCorrectionData
}>()

const route = useRoute()

const username = route.params.username as string
const queryClient = useQueryClient()
const localeWithDefaultRegion = useLocaleWithDefaultRegion()
const modelValue = defineModel<boolean>()
const toast = useToast()
const { t } = useI18nExperimental()

const messageAnalyzeExplanationQuery = useQuery({
  queryKey: queryKeys.messageAnalysisExplanation(localeWithDefaultRegion.value, toRef(props, 'messageId')),
  queryFn: () => $fetch(`/api/analysis/${props.messageId}/summary`, {
    method: 'GET',
    query: {
      locale: localeWithDefaultRegion.value,
    },
  }),
})
await messageAnalyzeExplanationQuery.suspense()

const regenerateMessageAnalysisExplanationMutation = useMutation({
  mutationKey: queryKeys.regenerateMessageAnalysisExplanation(localeWithDefaultRegion.value, toRef(props, 'messageId')),
  mutationFn: () => $fetch(`/api/analysis/${props.messageId}/summary`, {
    method: 'POST',
    query: {
      locale: localeWithDefaultRegion.value,
    },
  }),
})

watch(messageAnalyzeExplanationQuery.error, (error) => {
  if (error) {
    toast.error(t('Failed to generate analysis explanation.'))
  }
})

const messageExplanation = computed(() =>
  regenerateMessageAnalysisExplanationMutation.data?.value?.content
  || messageAnalyzeExplanationQuery.data?.value?.content,
)

const isLoading = computed(() =>
  regenerateMessageAnalysisExplanationMutation.isPending.value
  || messageAnalyzeExplanationQuery.isLoading.value,
)

const isError = computed(() =>
  regenerateMessageAnalysisExplanationMutation.isError.value
  || messageAnalyzeExplanationQuery.isError.value,
)

function refetch() {
  regenerateMessageAnalysisExplanationMutation.mutate()
  messageAnalyzeExplanationQuery.refetch()
}

function regenerateExplanation() {
  regenerateMessageAnalysisExplanationMutation.mutate()
}

const reAnalyzeMutation = useMutation({
  mutationKey: queryKeys.reAnalyzeMessage(localeWithDefaultRegion.value, toRef(props, 'messageId')),
  mutationFn: () => $fetch(`/api/analysis/${props.messageId}/reanalyze`, {
    method: 'POST',
    query: {
      locale: localeWithDefaultRegion.value,
    },
  }),
  onSuccess: (data) => {
    queryClient.setQueryData(queryKeys.history(username), (oldData: History) => {
      const newData = oldData.map((message) => {
        if (message.id === props.messageId) {
          return {
            ...message,
            correctedMessage: [
              {
                content: data.correctedMessage?.content,
                severity: data.correctedMessage?.severity,
                id: data.correctedMessage?.id,
              },
            ],
          }
        }
        return message
      })

      return newData
    })

    queryClient.setQueryData(
      queryKeys.messageAnalysisExplanation(localeWithDefaultRegion.value, toRef(props, 'messageId')),
      () => {
        return {
          id: data.messageAnalysis.id,
          content: data.messageAnalysis.content,
        }
      },
    )

    toast.success(t('Message re-analysis started. The new analysis will be available shortly.'))
  },
  onError: () => {
    toast.error(t('Failed to re-analyze the message.'))
  },
})

function ignoreAllMistakes() {
  toast.error(t('This feature is not available yet.'))
}
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    hide-confirm
    :title="t('Message analysis')"
  >
    <div class="sm:px-8 space-y-4">
      <div>
        <div class="chat-bubble-bg flex flex-col rounded-3xl px-2 py-2 min-w-32 bg-neutral-100 z-20 rounded-br-md w-full">
          <div class="px-2 mb-4">
            <template v-if="messageCorrection?.status === 'needs_correction' && messageCorrection?.severity">
              <AssistanceDiff :original-text="message" :corrected-text="messageCorrection!.correctedMessage!" />
            </template>
            <template v-else>
              {{ message }}
            </template>
          </div>
        </div>

        <div class="py-4 flex flex-col gap-2">
          <template v-if="messageCorrection?.status === 'needs_correction' && messageCorrection?.severity">
            <CommonResource
              :for="{
                isLoading,
                isError,
                data: messageExplanation,
                refetch,
              }"
            >
              <article class="prose prose-sm prose-neutral">
                {{ messageExplanation }}
              </article>
            </CommonResource>

            <Button
              v-if="!isError"
              class="btn btn-neutral btn-sm w-fit"
              icon="material-symbols:auto-awesome-outline-rounded"
              type="button"
              :disabled="isLoading"
              @click="regenerateExplanation()"
            >
              {{ t("Regenerate explanation") }}
            </Button>
          </template>

          <template v-else>
            <article class="prose prose-sm prose-neutral">
              {{ t('It seems your message is already perfect! We didn\'t find any mistakes in grammar, vocabulary, or phrasing. Great job! Keep up the good work.') }}
            </article>
          </template>
        </div>
      </div>

      <small class="flex items-center gap-2 text-xs text-gray-500">
        {{ t('Analysis is powered by AI, so the results may not be perfect.') }}
      </small>

      <div class="flex items-center gap-2 justify-end">
        <div class="flex items-center gap-2">
          <Button
            icon="material-symbols:refresh-rounded"
            class="btn btn-dash btn-warning btn-sm"
            type="button"
            :loading="reAnalyzeMutation.isPending.value"
            @click="reAnalyzeMutation.mutate()"
          >
            {{ t('Re-analyze the message') }}
          </Button>

          <Button
            v-if="messageCorrection?.status === 'needs_correction'"
            class="btn btn-soft btn-error btn-sm"
            icon="material-symbols:delete-outline-rounded"
            type="button"
            :loading="false"
            @click="ignoreAllMistakes()"
          >
            {{ t("Ignore all mistakes") }}
          </Button>
        </div>
      </div>
    </div>
  </Modal>
</template>
