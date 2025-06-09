<script setup lang="ts">
import { t } from '@psitta/vue'
import { buildCharacter, isRootDrawerOpen, isWhatsNewModalOpen, manageContact } from '~/store'

const whatsNew = useWhatsNew()

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}
</script>

<template>
  <div class="flex flex-col w-full h-dvh bg-white">
    <Navbar class="bg-gray-800" hide-back="on-lg" hide-title>
      <div class="flex gap-1 items-center -translate-x-1.5 z-50">
        <Button
          class="btn btn-neutral btn-circle btn-ghost lg:hidden"
          @click="isRootDrawerOpen = true"
        >
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="material-symbols:menu-rounded" />
          </span>
        </Button>
      </div>

      <div class="flex gap-1 items-center translate-x-1.5 z-50">
        <Button
          class="btn btn-neutral btn-circle btn-ghost"
          no-disable-on-loading
          :class="{
            'text-orange-500': whatsNew.hasUnreadContent.value,
            'text-black': !whatsNew.hasUnreadContent.value,
          }"
          :loading="whatsNew.countQuery.isLoading.value"
          @click="isWhatsNewModalOpen = true"
        >
          <Icon v-if="!whatsNew.countQuery.isLoading.value" name="material-symbols:campaign-outline-rounded" />
        </Button>

        <Button
          class="btn btn-neutral btn-circle btn-ghost"
          no-disable-on-loading
          @click="goToDiscover()"
        >
          <Icon name="material-symbols:person-search-outline" />
        </Button>

        <ChatListOptionsButton hide-home />
      </div>
    </Navbar>

    <main class="flex-1 px-4 py-4 w-full sm:w-[500px] lg:w-[600px] sm:mx-auto">
      <div class="flex flex-col h-full items-center justify-center">
        <Icon
          name="material-symbols:contextual-token-add-rounded"
          class="text-9xl text-gray-100 mb-2 flex items-center gap-2"
        />

        <h1 class="text-3xl sm:text-6xl text-black mb-4 flex items-center gap-2">
          Thal
        </h1>

        <div class="text-center text-lg text-black max-w-lg mb-12">
          <p class="text-gray-500 text-sm">
            {{ t('Forget waiting for perfection. Dive into dialogue, make mistakes, be human — and let learning happen along the way.') }}
          </p>

          <p class="text-gray-500 text-sm mt-4">
            {{ t('Talk to thals to practice, learn, and have fun.') }}
          </p>
        </div>

        <div class="flex gap-2 justify-center flex-wrap">
          <Button class="btn sm:btn-lg btn-neutral text-magenta-500" @click="goToDiscover">
            <Icon name="material-symbols:person-search-outline-rounded" />
            {{ t("Discover characters") }}
          </Button>

          <Button class="btn sm:btn-lg btn-neutral text-blue-500" @click="buildCharacter(null)">
            <Icon name="material-symbols:frame-person-outline-rounded" />
            {{ t("Create character") }}
          </Button>

          <Button class="btn sm:btn-lg btn-neutral text-orange-500" @click="manageContact(null)">
            <Icon name="material-symbols:person-add-outline-rounded" />
            {{ t("Add contact") }}
          </Button>

          <Button class="btn sm:btn-lg btn-neutral text-red-500" @click="isWhatsNewModalOpen = true">
            <Icon name="material-symbols:news-outline-rounded" />
            {{ t("What's New") }}
          </Button>
        </div>
      </div>
    </main>

    <footer class="flex px-4 py-4">
      <div class="sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto flex gap-2 items-center justify-center">
        <Icon name="material-symbols:science-outline" class="text-xl" />

        <p class="text-xs">
          {{ t('Thal messages are powered by generative AI.') }}
        </p>
      </div>
    </footer>
  </div>
</template>
