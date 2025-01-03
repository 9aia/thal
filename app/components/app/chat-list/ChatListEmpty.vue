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
  <div class="w-full text-center pt-8">
    <div class="text-primary flex items-center justify-center">
      <Icon name="chat" style="font-size: 8rem" />
    </div>

    <h2 class="text-lg font-medium px-4 py-2">
      {{ t("New Chat") }}
    </h2>

    <p class="px-4 text-sm text-gray-700 mb-8">
      {{ t("Begin a conversation with a character or create a custom one tailored to your learning objectives.") }}
    </p>

    <div class="px-4 flex gap-2 justify-center flex-wrap">
      <Btn class="btn-outline pl-2 border-green-500 text-green-500 hover:bg-green-500 hover:border-green-500 hover:text-slate-900" @click="goToDiscover">
        <Icon name="person_search" />
        {{ t("Discover characters") }}
      </Btn>

      <Btn class="btn-outline pl-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:border-purple-500 hover:text-slate-900" @click="buildPersona(null)">
        <Icon name="person_edit" />
        {{ t("Create character") }}
      </Btn>

      <Btn class="btn-outline pl-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:border-orange-500 hover:text-slate-900" @click="manageContact(null)">
        <Icon name="person_add" />
        {{ t("Add contact") }}
      </Btn>

      <Btn class="btn-outline pl-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:border-blue-500 hover:text-slate-900" @click="openWhatsNewModal">
        <Icon name="news" />
        {{ t("What's New") }}
      </Btn>
    </div>
  </div>
</template>
