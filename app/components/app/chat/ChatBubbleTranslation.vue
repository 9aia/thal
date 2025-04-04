<script setup lang="ts">
import { t } from '@psitta/vue'
import type { Translation } from '~/composables/useTranslation'

const props = defineProps<{
  translation: Translation
}>()

const {
  isOpen,
  isError,
  translation,
  refetch,
} = props.translation
</script>

<template>
  <div v-if="translation" class="bg-gradient-7 rounded-2xl px-3 py-2 min-h-[38px] flex items-start justify-between gap-2 group/translation">
    <article class="text-gradient-7 text-sm">
      {{ translation }}
    </article>

    <div class="items-start min-w-[32px] min-h-[32px] flex">
      <Button class="btn-ghost hidden group-hover/translation:block" size="sm" shape="circle" @click="isOpen = false">
        <Icon name="close" style="font-size: 1.15rem" />
      </Button>
    </div>
  </div>

  <div
    v-if="isError && isOpen"
    class="bg-gradient-8 rounded-lg mt-2 mb-1 px-3 py-2 min-h-[38px] flex items-start justify-between gap-2 group/translation"
  >
    <div class="text-gray-800 text-sm">
      {{ t("An error occurred while translating the message") }}
    </div>

    <div class="items-start min-w-[64px] min-h-[32px] flex">
      <Button class="btn-ghost hidden group-hover/translation:block" size="sm" shape="circle" @click="refetch()">
        <Icon name="refresh" style="font-size: 1.15rem" />
      </Button>

      <Button class="btn-ghost hidden group-hover/translation:block" size="sm" shape="circle" @click="isOpen = false">
        <Icon name="close" style="font-size: 1.15rem" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-7 {
  /* @apply bg-yellow-500/20; */
  background: radial-gradient(at bottom, theme('colors.magenta.50'), theme('colors.gray.50'));
  @apply text-orange-900;
}

.text-gradient-7 {
  background: linear-gradient(12deg, theme('colors.magenta.500'), theme('colors.red.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.bg-gradient-8 {
  background: radial-gradient(at top, theme('colors.red.100'), theme('colors.white'));
}
</style>
