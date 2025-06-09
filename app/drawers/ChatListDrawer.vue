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
</script>

<template>
  <div class="bg-white flex flex-col h-dvh justify-between">
    <Navbar hide-title hide-back="always">
      <div class="flex gap-1 items-center -translate-x-1.5 z-50">
        <Button
          class="btn btn-neutral btn-circle btn-ghost"
          no-disable-on-loading
          @click="isRootDrawerOpen = false"
        >
          <Icon name="material-symbols:chat-outline-rounded" />
        </Button>
      </div>

      <div class="flex gap-1 items-center translate-x-1.5 z-50">
        <Button
          class="btn btn-neutral btn-circle btn-ghost lg:hidden"
          no-disable-on-loading
          @click="isRootDrawerOpen = false"
        >
          <Icon name="material-symbols:arrow-menu-close-rounded" />
        </Button>
      </div>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <PastDueAppNote />

      <form v-if="chatsQuery.data.value?.length" class="px-4 py-2">
        <SearchField
          v-model="form.values.search"
          :placeholder="t('Search name or username...')"
          path="search"
          autofocus
          input-class="input-lg input-primary w-full"
        />
      </form>

      <div class="flex-1 overflow-y-auto bg-white">
        <ChatItemList />
      </div>

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
