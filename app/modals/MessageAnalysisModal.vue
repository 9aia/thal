<script setup lang="ts">
import type { MessageAnalysis } from '~/types'

defineProps<{
  messageAnalysis?: MessageAnalysis
}>()

const modelValue = defineModel<boolean>()
const { t } = useI18nExperimental()

function handleExplain(index: number) {
  console.log('explain', index)
}

function handleIgnore(index: number) {
  console.log('ignore', index)
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
        <ul v-if="messageAnalysis?.length" class="space-y-4">
          <li
            v-for="item, i in messageAnalysis[0].data"
            :key="`analysis-${i}`"
          >
            <div>
              <article>
                {{ item.data }}
              </article>

              <div>
                DIFF
              </div>

              <div class="flex items-center gap-2">
                <Button
                  class="btn btn-neutral"
                  icon="material-symbols:auto-awesome-outline-rounded"
                  @click="handleExplain(i)"
                >
                  {{ t("Explain") }}
                </Button>

                <Button
                  class="btn btn-neutral"
                  icon="material-symbols:close-outline-rounded"
                  @click="handleIgnore(i)"
                >
                  {{ t("Ignore") }}
                </Button>
              </div>
            </div>
          </li>
        </ul>

        <div class="flex items-center gap-2">
          <Button
            icon="material-symbols:auto-awesome-outline-rounded"
            class="btn btn-neutral"
            @click="handleReAnalyze()"
          >
            {{ t('Re-analyze') }}
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
