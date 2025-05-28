<script setup lang="ts">
import { t } from '@psitta/vue'
import { buildCharacter, isRootDrawerOpen, manageContact } from '~/store'

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

const isWhatsNewModalOpen = ref(false)
</script>

<template>
  <div class="w-full text-center pt-8 pb-8">
    <h2 class="flex items-center justify-center gap-1 text-lg font-medium px-4 py-1">
      <div class="flex items-center justify-center">
        <Icon name="material-symbols:contextual-token-add-outline" class="text-4xl -scale-x-100" />
      </div>
      {{ t("New Chat") }}
    </h2>

    <p class="px-4 text-xs text-gray-700 mb-8">
      {{ t('Start chatting with an AI character to improve your English!') }}
    </p>

    <div class="px-4 flex gap-2 justify-center flex-wrap">
      <Button class="border-gradient-1 rounded-full" @click="goToDiscover">
        <span class="px-4 py-1 flex items-center justify-center gap-1">
          <Icon name="material-symbols:person-search-outline" />
          {{ t("Discover characters") }}
        </span>
      </Button>

      <Button class="border-gradient-2 rounded-full" @click="buildCharacter(null)">
        <span class="px-4 py-1 flex items-center justify-center gap-1">
          <Icon name="material-symbols:person-edit-outline" />
          {{ t("Create character") }}
        </span>
      </Button>

      <Button class="border-gradient-3 rounded-full" @click="manageContact(null)">
        <span class="px-4 py-1 flex items-center justify-center gap-1">
          <Icon name="material-symbols:person-add-outline" />
          {{ t("Add contact") }}
        </span>
      </Button>

      <Button class="border-gradient-4 rounded-full" @click="isWhatsNewModalOpen = true">
        <WhatsNewModal v-model="isWhatsNewModalOpen" />

        <span class="px-4 py-1 flex items-center justify-center gap-1">
          <Icon name="material-symbols:news-outline" />
          {{ t("What's New") }}
        </span>
      </Button>
    </div>
  </div>
</template>
