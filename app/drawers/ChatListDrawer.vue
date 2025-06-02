<script setup lang="ts">
import { t } from '@psitta/vue'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { chatListSearch, drawers, isRootDrawerOpen, isWhatsNewModalOpen } from '~/store'

const form = useForm({
  initialValues: {
    search: '',
  },
})

const localWithDefaultRegion = useLocaleDefaultRegion()
const whatsNew = useWhatsNew()

watchDebounced(toRef(() => form.values.search), () => {
  chatListSearch.value = form.values.search
}, { debounce: 500 })

const {
  data: chats,
} = useServerQuery({
  queryKey: queryKeys.chatsSearch(localWithDefaultRegion.value, chatListSearch),
  queryFn: () => serverFetch('/api/chat', {
    params: {
      search: chatListSearch.value,
      locale: localWithDefaultRegion.value,
    },
  }),
})

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}
</script>

<template>
  <div class="bg-white flex flex-col h-dvh justify-between">
    <Navbar hide-title hide-back>
      <h1 class="text-lg py-2 text-gradient-1 flex items-center gap-1">
        <A href="/app/" class="text-lg text-black flex items-center">
          {{ t("Thal") }}
        </A>
      </h1>

      <div class="flex items-center">
        <Button
          class="btn btn-circle btn-ghost"
          no-disable-on-loading
          :class="{
            'text-orange-500': whatsNew.hasUnreadContent.value,
            'text-black': !whatsNew.hasUnreadContent.value,
          }"
          :loading="whatsNew.countQuery.isLoading.value"
          @click="isWhatsNewModalOpen = true"
        >
          <Icon v-show="!whatsNew.countQuery.isLoading.value" name="material-symbols:campaign-outline-rounded" />
        </Button>

        <Button
          class="btn btn-circle btn-ghost"
          no-disable-on-loading
          @click="goToDiscover"
        >
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="material-symbols:person-search-outline-rounded" />
          </span>
        </Button>

        <ChatListOptionsButton />
      </div>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <PastDueAppNote />

      <div v-if="chats?.length" class="px-4 py-2">
        <SearchField
          v-model="form.values.search"
          :placeholder="t('Search name or username...')"
          path="search"
          autofocus
        />
      </div>

      <div class="flex-1 overflow-y-auto bg-white">
        <ChatItemList />
      </div>

      <div class="absolute bottom-4 right-4">
        <Button shape="circle" size="md" class="btn btn-lg btn-circle btn-primary" @click="drawers.newChat = true">
          <Icon name="material-symbols:add" />
        </Button>
      </div>
    </div>

    <WhatsNewModal v-model="isWhatsNewModalOpen" />
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: linear-gradient(50deg, var(--color-magenta-500), var(--color-red-500)) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
