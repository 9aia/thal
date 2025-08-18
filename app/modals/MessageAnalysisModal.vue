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

const explanationQuery = useQuery({
  queryKey: queryKeys.messageAnalysisExplanation(localeWithDefaultRegion.value, toRef(props, 'messageId')),
  queryFn: () => $fetch(`/api/analysis/${props.messageId}/explain`, {
    method: 'GET',
    query: {
      locale: localeWithDefaultRegion.value,
    },
  }),
})
await explanationQuery.suspense()

const reExplainMutation = useMutation({
  mutationKey: queryKeys.regenerateMessageAnalysisExplanation(localeWithDefaultRegion.value, toRef(props, 'messageId')),
  mutationFn: () => $fetch(`/api/analysis/${props.messageId}/explain`, {
    method: 'POST',
    query: {
      locale: localeWithDefaultRegion.value,
    },
  }),
})

watch(explanationQuery.error, (error) => {
  if (error) {
    toast.error(t('Failed to generate analysis explanation.'))
  }
})

const messageExplanation = computed(() =>
  reExplainMutation.data?.value?.localizations?.[0]?.content
  || explanationQuery.data?.value?.localizations?.[0]?.content,
)

const messageExplanationDate = computed(() =>
  reExplainMutation.data?.value?.createdAt
  || explanationQuery.data?.value?.createdAt,
)

const isLoading = computed(() =>
  reExplainMutation.isPending.value
  || explanationQuery.isLoading.value,
)

const isError = computed(() =>
  reExplainMutation.isError.value
  || explanationQuery.isError.value,
)

function refetch() {
  reExplainMutation.mutate()
}

function regenerateExplanation() {
  reExplainMutation.mutate()
}

const ignoreMistakesMutation = useMutation({
  mutationKey: queryKeys.ignoreMessageMistakes(localeWithDefaultRegion.value, toRef(props, 'messageId')),
  mutationFn: () => $fetch(`/api/analysis/${props.messageId}/ignore`, {
    method: 'POST',
    query: {
      locale: localeWithDefaultRegion.value,
    },
  }),
  onSuccess: () => {
    queryClient.setQueryData(queryKeys.history(username), (oldData: History) => {
      const newData = oldData.map((message) => {
        if (message.id === props.messageId) {
          return {
            ...message,
            correctedMessage: [
              {
                content: message.correctedMessage?.[0]?.content,
                severity: message.correctedMessage?.[0]?.severity,
                id: message.correctedMessage?.[0]?.id,
                ignoredAt: new Date().toISOString(),
              },
            ],
          }
        }
        return message
      })

      return newData
    })

    toast.success(t('All mistakes in this message have been ignored.'))
    modelValue.value = false
  },
  onError: () => {
    toast.error(t('Failed to ignore mistakes.'))
  },
})

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
                createdAt: data.correctedMessage?.createdAt,
              },
            ],
          }
        }
        return message
      })

      return newData
    })

    queryClient.setQueryData(queryKeys.messageAnalysisExplanation(localeWithDefaultRegion.value, toRef(props, 'messageId')), data.messageAnalysisExplanation)
  },
  onError: () => {
    toast.error(t('Failed to re-analyze the message.'))
  },
})

const explanationDate = computed(() => {
  const dateFormatter = new Intl.DateTimeFormat(localeWithDefaultRegion.value, {
    timeStyle: 'short',
    dateStyle: 'short',
  })

  return dateFormatter.format(new Date(messageExplanationDate.value ?? Date.now()))
})
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

            <div class="flex items-center justify-end gap-2 mt-1">
              <Button
                v-if="!isError && !messageCorrection?.ignoredAt"
                class="btn btn-neutral btn-sm w-fit"
                icon="material-symbols:auto-awesome-outline-rounded"
                type="button"
                :disabled="isLoading"
                @click="regenerateExplanation()"
              >
                {{ t("Regenerate explanation") }}
              </Button>

              <Button
                v-if="messageCorrection?.status === 'needs_correction' && !messageCorrection?.ignoredAt"
                class="btn btn-error btn-soft btn-sm w-fit"
                icon="material-symbols:delete-outline-rounded"
                type="button"
                :disabled="isLoading"
                :loading="ignoreMistakesMutation.isPending.value"
                @click="ignoreMistakesMutation.mutate()"
              >
                {{ t("Ignore mistakes") }}
              </Button>

              <Button
                v-else
                icon="material-symbols:refresh-rounded"
                class="btn btn-soft btn-warning btn-sm"
                type="button"
                :loading="reAnalyzeMutation.isPending.value"
                @click="reAnalyzeMutation.mutate()"
              >
                {{ t('Re-analyze the message') }}
              </Button>
            </div>
          </template>

          <template v-else>
            <article class="prose prose-sm prose-neutral">
              {{ t('It seems your message is already perfect! We didn\'t find any mistakes in grammar, vocabulary, or phrasing. Great job! Keep up the good work.') }}
            </article>
          </template>
        </div>
      </div>

      <ExpandableWarning
        type="button"
        class="text-xs text-gray-300 text-left px-0"
        :initial-text="t('Analysis from {time}. AI results may vary.', {
          time: explanationDate,
        })"
        :expanded-text="t('If you\'ve sent more messages since this analysis was created, try regenerating it for improved accuracy and context.')"
      />
    </div>
  </Modal>
</template>
