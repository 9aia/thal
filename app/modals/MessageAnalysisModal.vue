<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import { useMutation } from '@tanstack/vue-query'
import CommonResource from '~/components/app/common/state/CommonResource.vue'
import type { MessageCorrectionData } from '~/types'

const props = defineProps<{
  message: string
  messageId: number
  messageCorrection?: MessageCorrectionData
}>()

const locale = useLocaleWithDefaultRegion()
const modelValue = defineModel<boolean>()
const { t } = useI18nExperimental()

const messageAnalyzeSummaryMutation = useMutation({
  mutationFn: () => $fetch(`/api/analysis/${props.messageId}/summary`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    query: {
      locale: locale.value,
    },
  }),
  onSuccess: (data) => {
    console.log('Analysis successful:', data)
  },
  onError: (error) => {
    console.error('Analysis failed:', error)
  },
})

function handleExplain() {
  messageAnalyzeSummaryMutation.mutateAsync()
}

function handleIgnore() {
  console.log('ignore')
}

function handleReAnalyze() {
  console.log('re-analyze')
}
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    hide-confirm
    :title="t('Message analysis')"
  >
    <template #default>
      <div class="px-8 space-y-4">
        <div>
          <template v-if="messageCorrection?.status === 'needs_correction' && messageCorrection?.severity">
            <div class="space-y-3">
              <!-- Original Message Section -->
              <div class="rounded-3xl p-6 bg-gradient-info">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-black">
                      {{ t('Original message') }}
                    </span>
                  </div>

                  <!-- Severity Badge -->
                  <div class="flex items-center gap-1">
                    <span class="text-xs text-black">{{ t('Error Severity:') }}</span>
                    <span
                      class="badge badge-outline"
                      :class="{
                        'badge-primary': messageCorrection?.severity === 'minor',
                        'badge-warning': messageCorrection?.severity === 'moderate',
                        'badge-error': messageCorrection?.severity === 'major',
                      }"
                    >
                      <template v-if="messageCorrection?.severity === 'minor'">
                        {{ t('Minor ::severity::').replace('::severity::', '') }}
                      </template>
                      <template v-else-if="messageCorrection?.severity === 'moderate'">
                        {{ t('Moderate ::severity::').replace('::severity::', '') }}
                      </template>
                      <template v-else-if="messageCorrection?.severity === 'major'">
                        {{ t('Major ::severity::').replace('::severity::', '') }}
                      </template>
                    </span>
                  </div>
                </div>

                <p class="text-black">
                  {{ message }}
                </p>

                <!-- Corrected Message Section -->
                <div class="mt-4">
                  <div class="flex items-center gap-2 mb-2">
                    <Icon name="material-symbols:check-circle-outline-rounded" class="text-blue-500 text-lg" />
                    <span class="text-sm text-blue-500">
                      {{ t('Suggested correction') }}
                    </span>
                  </div>
                  <p class="text-blue-500">
                    {{ messageCorrection.correctedMessage }}
                  </p>
                </div>
              </div>
            </div>

            <div class="py-6">
              <h3 class="text-xs text-black mb-4">
                {{ t('Analysis summary') }}
              </h3>

              <CommonResource
                :for="{
                  isLoading: messageAnalyzeSummaryMutation.isPending.value,
                  isError: messageAnalyzeSummaryMutation.isError.value,
                  data: messageAnalyzeSummaryMutation.data.value,
                  refetch: messageAnalyzeSummaryMutation.mutateAsync,
                }"
              >
                <article class="prose prose-sm prose-neutral">
                  {{ messageAnalyzeSummaryMutation.data?.value?.content }}
                </article>
              </CommonResource>
            </div>
          </template>

          <template v-else>
            <div class="rounded-3xl p-6 bg-gradient-success">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-black">
                    {{ t('Verified message') }}
                  </span>
                </div>
              </div>

              <p class="text-black">
                {{ message }}
              </p>
            </div>

            <div class="py-6">
              <h3 class="text-xs text-black mb-4">
                {{ t('Verification summary') }}
              </h3>

              <article class="prose prose-sm prose-neutral">
                {{ t('This message is grammatically correct and well-formed.') }}
              </article>
            </div>
          </template>
        </div>

        <div v-if="messageCorrection?.status === 'needs_correction'" class="flex items-center gap-2 justify-between">
          <div class="flex items-center gap-2">
            <Button
              class="btn btn-neutral btn-sm"
              icon="material-symbols:delete-outline-rounded"
              @click="handleIgnore()"
            >
              {{ t("Ignore") }}
            </Button>

            <Button
              icon="material-symbols:refresh-rounded"
              class="btn btn-neutral btn-sm"
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
      </div>
    </template>
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
