<script setup lang="ts">
import { t } from '@psitta/vue'
import { buildPersona, isRootDrawerOpen, manageContact } from '~/store'

const { open: openWhatsNewModal } = useWhatsNewModal()

function goToDiscover() {
  isRootDrawerOpen.value = false
  navigateTo('/app/discover')
}
</script>

<template>
  <div class="w-full text-center pt-8 pb-8">
    <h2 class="flex items-center justify-center gap-1 text-lg font-medium px-4 py-2">
      <div class="flex items-center justify-center">
        <Icon name="contextual_token_add" class="text-4xl -scale-x-100" />
      </div>
      {{ t("New Chat") }}
    </h2>

    <p class="px-4 text-xs text-gray-700 mb-8">
      {{ t('Start chatting with an AI character to improve your English!') }}
    </p>

    <div class="px-4 flex gap-2 justify-center flex-wrap">
      <Button class="border-gradient-1" @click="goToDiscover">
        <span class="px-4 py-2 flex items-center justify-center gap-1">
          <Icon name="person_search" />
          {{ t("Discover characters") }}
        </span>
      </Button>

      <Button class="border-gradient-2" @click="buildPersona(null)">
        <span class="px-4 py-2 flex items-center justify-center gap-1">
          <Icon name="person_edit" />
          {{ t("Create character") }}
        </span>
      </Button>

      <Button class="border-gradient-3" @click="manageContact(null)">
        <span class="px-4 py-2 flex items-center justify-center gap-1">
          <Icon name="person_add" />
          {{ t("Add contact") }}
        </span>
      </Button>

      <Button class="border-gradient-4" @click="openWhatsNewModal">
        <span class="px-4 py-2 flex items-center justify-center gap-1">
          <Icon name="news" />
          {{ t("What's New") }}
        </span>
      </Button>
    </div>
  </div>
</template>

<style scoped>
.text-gradient-1 {
  @apply text-gray-100;
}

.border-gradient-1 {
  @apply border-2 border-gray-100 p-0;

  background: linear-gradient(50deg, theme('colors.blue.500'), theme('colors.magenta.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.border-gradient-1:hover {
  @apply border-2 border-gray-200 p-0;
}

.border-gradient-2 {
  @apply border-2 border-gray-100 p-0;

  background: linear-gradient(50deg, theme('colors.red.500'), theme('colors.magenta.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.border-gradient-2:hover {
  @apply border-2 border-gray-200 p-0;
}

.border-gradient-3 {
  @apply border-2 border-gray-100 p-0;

  background: linear-gradient(50deg, theme('colors.orange.500'), theme('colors.red.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.border-gradient-3:hover {
  @apply border-2 border-gray-200 p-0;
}

.border-gradient-4 {
  @apply border-2 border-gray-100 p-0;

  background: linear-gradient(50deg, theme('colors.blue.500'), theme('colors.cyan.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.border-gradient-4:hover {
  @apply border-2 border-gray-200 p-0;
}
</style>
