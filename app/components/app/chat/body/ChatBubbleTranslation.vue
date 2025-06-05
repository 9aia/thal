<script setup lang="ts">
import type { FetchError } from 'ofetch'
import type { Translation } from '~/composables/useTranslation'

const props = defineProps<{
  translation: Translation
}>()

const {
  isOpen,
  error,
  translation,
  refetch,
} = props.translation

const { t } = useI18nExperimental()
</script>

<template>
  <div v-if="translation" class="bg-radial-[at_bottom] from-magenta-50 to-gray-50 text-orange-900 rounded-2xl px-3 py-2 min-h-[38px] flex items-start justify-between gap-2 group/translation">
    <article class="text-gradient bg-linear-[12deg] from-magenta-500 to-red-500 text-sm">
      {{ translation }}
    </article>

    <div class="items-start min-w-[32px] min-h-[32px] flex">
      <Button
        class="btn-ghost hidden group-hover/translation:block"
        shape="circle"
        size="sm"
        @click="isOpen = false"
      >
        <Icon name="material-symbols:close" class="text-base" />
      </Button>
    </div>
  </div>

  <div
    v-if="error && isOpen"
    class="bg-radial-[at_top] from-red-100 to-white rounded-lg mt-2 mb-1 px-3 py-2 min-h-[38px] flex items-start justify-between gap-2 group/translation"
  >
    <div v-if="(error as FetchError).status === RATE_LIMIT_STATUS_CODE" class="text-gray-800 text-sm">
      {{ t("You are translating messages too fast. Please wait a moment.") }}
    </div>
    <div v-else class="text-gray-800 text-sm">
      {{ t('Failed to translate message. Try again later.') }}
    </div>

    <div class="items-start min-w-[64px] min-h-[32px] flex">
      <Button class="btn-ghost hidden group-hover/translation:block" shape="circle" @click="refetch()">
        <Icon name="material-symbols:refresh" class="text-base" />
      </Button>

      <Button class="btn-ghost hidden group-hover/translation:block" shape="circle" @click="isOpen = false">
        <Icon name="material-symbols:close" class="text-base" />
      </Button>
    </div>
  </div>
</template>
