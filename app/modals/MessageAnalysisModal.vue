<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import type { MessageCorrectionData } from '~/types'

const props = defineProps<{
  message: string
  messageId: number
  messageCorrection?: MessageCorrectionData
}>()

const localeWithDefaultRegion = useLocaleWithDefaultRegion()
const modelValue = defineModel<boolean>()
const toast = useToast()
const { t } = useI18nExperimental()

const messageAnalyzeSummaryQuery = useQuery({
  queryKey: queryKeys.messageAnalysisSummary(localeWithDefaultRegion.value, toRef(props, 'messageId')),
  queryFn: () => $fetch(`/api/analysis/${props.messageId}/summary`, {
    method: 'GET',
    query: {
      locale: localeWithDefaultRegion.value,
    },
  }),
  enabled: !!props.messageId,
})
await messageAnalyzeSummaryQuery.suspense()

watch(messageAnalyzeSummaryQuery.error, (error) => {
  if (error) {
    toast.error(t('Failed to generate analysis summary.'))
  }
})

function handleExplain() {
  toast.error(t('This feature is not available yet.'))
}

function handleReAnalyze() {
  // TODO: Implement re-analyze (regenerate the message correction and summary, and explain if applicable)
  messageAnalyzeSummaryQuery.refetch()
}

const isSeverityOpen = ref(false)
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
        <template v-if="messageCorrection?.status === 'needs_correction' && messageCorrection?.severity">
          <div class="mb-4">
            <p class="text-xl">
              <AssistanceDiff :original-text="message" :corrected-text="messageCorrection!.correctedMessage!" />
            </p>
          </div>

          <div class="p-6 bg-gradient-info rounded-3xl">
            <h3 class="text-xs text-black mb-4">
              {{ t('Suggested correction') }}
            </h3>

            <CommonResource
              :for="messageAnalyzeSummaryQuery"
            >
              <article class="prose prose-sm prose-neutral">
                {{ messageAnalyzeSummaryQuery.data?.value?.content }}
              </article>
            </CommonResource>
          </div>
        </template>

        <template v-else>
          <div class="mb-6">
            <p class="text-xl gap-2 flex items-center mb-6">
              <span class="text-blue-500">
                {{ message }}
              </span>
            </p>

            <p class="text-xl text-black flex items-center gap-2">
              {{ t('This message is grammatically correct, well-formed, and suitable for the context.') }}
            </p>
          </div>
        </template>
      </div>

      <p v-if="messageCorrection?.status === 'needs_correction'" class="text-sm text-black mb-2">
        <span
          :class="{
            'text-brown-500': messageCorrection?.severity === 'minor',
            'text-orange-500': messageCorrection?.severity === 'moderate',
            'text-red-500': messageCorrection?.severity === 'major',
          }"
        >
          <template v-if="messageCorrection?.severity === 'minor'">
            {{ t('Minor mistake ::severity::').replace('::severity::', '') }}
          </template>

          <template v-else-if="messageCorrection?.severity === 'moderate'">
            {{ t('Moderate mistake ::severity::').replace('::severity::', '') }}
          </template>

          <template v-else-if="messageCorrection?.severity === 'major'">
            {{ t('Major mistake ::severity::').replace('::severity::', '') }}
          </template>

          <template v-if="!isSeverityOpen">
            ...
          </template>
        </span>

        <template v-if="isSeverityOpen">
          <template v-if="messageCorrection?.severity === 'minor'">
            {{ t('is a small mistake that doesn\'t hinder understanding, for example: \'i\' instead of \'I\', \'hte\' instead of \'the\', or a missing period.') }}
          </template>

          <template v-else-if="messageCorrection?.severity === 'moderate'">
            {{ t('is a noticeable mistake that might make the text sound unnatural or slightly confusing, for example: incorrect verb tense like \'he go\' instead of \'he goes\', or a plural/singular mismatch like \'a cats\'.') }}
          </template>

          <template v-else-if="messageCorrection?.severity === 'major'">
            {{ t('is a significant mistake that makes the message difficult to understand or grammatically incorrect. This includes clear syntactical errors, severe spelling mistakes, or jumbled sentence structures. For example: a missing verb like \'He to the store\', a severe spelling error that makes a key word unrecognizable, or a jumbled sentence like \'to want work you?\'.') }}
          </template>
        </template>

        <span>
          <button
            class="ml-1 text-sm text-blue-500 text-center cursor-pointer focus:outline-none group border-y-2 border-transparent focus:border-b-blue-500"
            type="button"
            @click="isSeverityOpen = !isSeverityOpen"
          >
            {{ isSeverityOpen ? t('Read less') : t('Read more') }}
          </button>
        </span>
      </p>

      <div v-if="messageCorrection?.status === 'needs_correction'" class="flex items-center gap-2 justify-between">
        <div class="flex items-center gap-2">
          <!-- TODO: Add "Ignore" button -->
          <!-- <Button
              class="btn btn-neutral btn-sm"
              icon="material-symbols:delete-outline-rounded"
              type="button"
              @click="handleIgnore()"
            >
              {{ t("Ignore") }}
            </Button> -->

          <Button
            icon="material-symbols:refresh-rounded"
            class="btn btn-neutral btn-sm"
            type="button"
            @click="handleReAnalyze()"
          >
            {{ t('Re-analyze') }}
          </Button>
        </div>

        <Button
          class="btn btn-primary"
          icon="material-symbols:auto-awesome-outline-rounded"
          type="button"
          @click="handleExplain()"
        >
          {{ t("Explain") }}
        </Button>
      </div>

      <small class="flex items-center gap-2 text-xs text-gray-500">
        {{ t('Analysis is powered by AI. The results may not be perfect.') }}
      </small>
    </div>
  </Modal>
</template>

<style scoped>
.bg-gradient-primary {
  background: radial-gradient(at bottom, var(--color-blue-100), var(--color-gray-50));
}

.bg-gradient-secondary {
  background: radial-gradient(at bottom, var(--color-magenta-50), var(--color-gray-50));
}

.bg-gradient-warning {
  background: radial-gradient(at bottom, var(--color-orange-100), var(--color-gray-50));
}

.bg-gradient-error {
  background: radial-gradient(at bottom, var(--color-red-100), var(--color-gray-50));
}

.bg-gradient-info {
  background: radial-gradient(at bottom, var(--color-blue-100), var(--color-gray-50));
}

.bg-gradient-success {
  background: radial-gradient(at bottom, var(--color-green-100), var(--color-gray-50));
}

.bg-gradient-neutral {
  background: radial-gradient(at bottom, var(--color-gray-100), var(--color-gray-50));
}
</style>
