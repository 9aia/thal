<script setup lang="ts">
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import { buildCharacter, isWhatsNewModalOpen, manageContact } from '~/store'

const whatsNew = useWhatsNew()

const { t } = useI18nExperimental()
const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)

async function goToDiscover() {
  sidebar.open.value = false
  await navigateTo('/app/discover')
}

function createCharacter() {
  buildCharacter(null)
  sidebar.push('build-character')
}

function addContact() {
  manageContact(null)
  sidebar.push('manage-contact')
}
</script>

<template>
  <div class="flex flex-col w-full h-dvh bg-white absolute overflow-y-auto">
    <Navbar
      class="bg-gray-800"
      hide-title
    >
      <div class="flex gap-1 items-center -translate-x-1.5 z-50">
        <Button
          as="label"
          for="sidebar-drawer"
          class="btn btn-neutral btn-circle btn-ghost lg:hidden"
          icon="material-symbols:menu-rounded"
        />
      </div>

      <div class="flex gap-1 items-center translate-x-1.5 z-50">
        <Button
          class="btn btn-neutral btn-circle btn-ghost"
          no-disable-on-loading
          :class="{
            'text-orange-500': whatsNew.hasUnreadContent.value,
            'text-black': !whatsNew.hasUnreadContent.value,
          }"
          :loading="whatsNew.countQuery.pending.value"
          icon="material-symbols:campaign-outline-rounded"
          @click="isWhatsNewModalOpen = true"
        />

        <Button
          class="btn btn-neutral btn-circle btn-ghost"
          no-disable-on-loading
          icon="material-symbols:person-search-outline-rounded"
          @click="goToDiscover()"
        />

        <CommonMenuButton />
      </div>
    </Navbar>

    <ReleaseBanner />

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
            {{ t('Talk to thals to practice and learn English, and have fun.') }}
          </p>
        </div>

        <div class="flex gap-2 justify-center flex-wrap">
          <Button
            class="btn sm:btn-lg btn-neutral text-magenta-500"
            icon="material-symbols:person-search-outline-rounded"

            @click="goToDiscover"
          >
            {{ t("Discover characters") }}
          </Button>

          <Button
            class="btn sm:btn-lg btn-neutral text-blue-500"
            icon="material-symbols:frame-person-outline-rounded"

            @click="createCharacter()"
          >
            {{ t("Create character") }}
          </Button>

          <Button
            class="btn sm:btn-lg btn-neutral text-orange-500"
            icon="material-symbols:person-add-outline-rounded"

            @click="addContact()"
          >
            {{ t("Add contact") }}
          </Button>

          <Button
            class="btn sm:btn-lg btn-neutral text-red-500"
            icon="material-symbols:campaign-outline-rounded"

            @click="isWhatsNewModalOpen = true"
          >
            {{ t("What's New") }}
          </Button>
        </div>
      </div>
    </main>

    <footer class="flex px-4 py-4">
      <div class="sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto flex gap-2 items-center justify-center">
        <Icon name="material-symbols:auto-awesome-outline-rounded" class="text-xl" />

        <p class="text-xs">
          {{ t('Thal messages are powered by generative AI.') }}
        </p>
      </div>
    </footer>
  </div>
</template>
