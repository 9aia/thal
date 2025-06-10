<script setup lang="ts">
import { t } from '@psitta/vue'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import type { MenuItemType } from '~/components/ui/navigation/types'
import queryKeys from '~/queryKeys'
import { buildCharacter, chatListSearch, drawers, isRootDrawerOpen, isWhatsNewModalOpen, manageContact } from '~/store'

const form = useForm({
  initialValues: {
    search: '',
  },
})

const localWithDefaultRegion = useLocaleDefaultRegion()

watchDebounced(toRef(() => form.values.search), () => {
  chatListSearch.value = form.values.search
}, { debounce: 500 })

const headers = useRequestHeaders(['cookie'])
const chatsQuery = useServerQuery({
  queryKey: queryKeys.chatsSearch(localWithDefaultRegion.value, chatListSearch),
  queryFn: () => $fetch('/api/chat', {
    params: {
      search: chatListSearch.value,
      locale: localWithDefaultRegion.value,
    },
    headers,
  }),
})

function goToHome() {
  isRootDrawerOpen.value = false
  navigateTo('/app/')
}

// function goToDiscover() {
//   isRootDrawerOpen.value = false
//   navigateTo('/app/discover/')
// }

// function openMyCharacters() {
//   drawers.myCharacters = true
// }

// const generalItems: MenuItemType[] = [
//   { id: 'create-character', icon: 'material-symbols:frame-person-outline-rounded', name: t('Build character'), onClick: () => buildCharacter(null) },
//   { id: 'new-contact', icon: 'material-symbols:person-add-outline-rounded', name: t('New contact'), onClick: () => manageContact(null) },
//   // { id: 'my-characters', icon: 'material-symbols:manage-accounts-outline-rounded', name: t('My characters'), onClick: () => openMyCharacters() },
// ]

// const discoverItems: MenuItemType[] = [
//   { id: 'discover-characters', icon: 'material-symbols:person-search-outline-rounded', name: t('Characters'), onClick: () => goToDiscover() },
// ]
</script>

<template>
  <div class="bg-white flex flex-col h-dvh justify-between">
    <Navbar hide-title hide-back="always">
      <div class="flex gap-1 items-center z-50">
        <h1>
          <button class="text-sm cursor-pointer border-b-2 border-b-transparent focus:border-b-primary focus:outline-hidden" @click="goToHome()">
            {{ t('Thal') }}
          </button>
        </h1>
      </div>

      <div class="flex gap-1 items-center translate-x-2 z-50">
        <Button
          class="btn btn-neutral btn-circle btn-ghost lg:hidden"
          no-disable-on-loading
          @click="isRootDrawerOpen = false"
        >
          <Icon name="material-symbols:arrow-menu-close-rounded" />
        </Button>
      </div>
    </Navbar>

    <div class="pt-2 flex-1 space-y-4 overflow-y-auto">
      <PastDueAppNote />

      <form v-if="chatsQuery.data.value?.length" class="px-6">
        <SearchField
          v-model="form.values.search"
          :placeholder="t('Search name or username...')"
          path="search"
          autofocus
          input-class="input-lg input-primary w-full"
        />
      </form>
      <!--
      <SettingSection
        title-class="px-6"
        body-class="px-4"
      >
        <ItemList :items="generalItems" />
      </SettingSection>

      <SettingSection
        :title="t('Discover')"
        title-class="px-6"
        body-class="px-4"
      >
        <ItemList :items="discoverItems" />
      </SettingSection> -->

      <SettingSection
        body-class="px-4"
      >
        <ChatItemList />
      </SettingSection>

      <div class="absolute bottom-4 right-4">
        <Button
          class="btn btn-lg btn-circle btn-primary"
          @click="drawers.newChat = true"
        >
          <Icon name="material-symbols:add" />
        </Button>
      </div>
    </div>

    <WhatsNewModal v-model="isWhatsNewModalOpen" />
  </div>
</template>
