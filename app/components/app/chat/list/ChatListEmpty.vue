<script setup lang="ts">
import { t } from '@psitta/vue'
import { buildCharacter, isRootDrawerOpen, isWhatsNewModalOpen, manageContact } from '~/store'

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

function print() {
  console.log('click')
}
</script>

<template>
  <div class="w-full text-center pt-8 pb-8">
    <h2 class="flex items-center justify-center gap-1 text-lg font-medium px-4 py-1">
      <div class="flex items-center justify-center">
        <Icon name="material-symbols:contextual-token-add-outline-rounded" class="text-4xl -scale-x-100" />
      </div>
      {{ t("New Chat") }}
    </h2>

    <p class="px-4 text-xs text-gray-700 mb-8">
      {{ t('Start chatting with an AI character to improve your English!') }}
    </p>

    <div class="px-4 flex gap-2 justify-center flex-wrap">
      <Button class="btn btn-neutral text-magenta-500" @click="goToDiscover">
        <Icon name="material-symbols:person-search-outline-rounded" />
        {{ t("Discover characters") }}
      </Button>

      <Button class="btn btn-neutral text-blue-500" @click="buildCharacter(null)">
        <Icon name="material-symbols:person-edit-outline-rounded" />
        {{ t("Create character") }}
      </Button>

      <Button class="btn btn-neutral text-orange-500" @click="manageContact(null)">
        <Icon name="material-symbols:person-add-outline-rounded" />
        {{ t("Add contact") }}
      </Button>

      <Button class="btn btn-neutral text-red-500" @click="isWhatsNewModalOpen = true">
        <Icon name="material-symbols:news-outline-rounded" />
        {{ t("What's New") }}
      </Button>
    </div>

    <WhatsNewModal v-model="isWhatsNewModalOpen" />
  </div>
</template>
