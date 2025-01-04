<script setup lang="ts">
import { t } from '@psitta/vue'
import { useQuery } from '@tanstack/vue-query'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { chatItemSearch, drawers, isRootDrawerOpen } from '~/store'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = useForm({
  initialValues: {
    search: '',
  },
})

watchDebounced(toRef(form.values, 'search'), () => {
  chatItemSearch.value = form.values.search
}, { debounce: 500 })

const {
  data: chats,
} = await useServerQuery(() => '/api/chat', {
  queryKey: queryKeys.chatsSearch(chatItemSearch),
  params: () => {
    return {
      search: chatItemSearch.value,
    }
  },
})

const isNoteVisible = useCookie('isNoteVisible', {
  default: () => true,
})

const lastSavedContentCount = useCookie('lastSavedContentCount', {
  default: () => 0,
})

const countQuery = useQuery({
  queryKey: ['content-count'],
  queryFn: async () => {
    const contentCount = await queryContent().count()
    return contentCount
  },
})

const hasUnreadContent = computed(() => {
  if (!countQuery.data.value) {
    return false
  }

  return countQuery.data.value > lastSavedContentCount.value
})

const { open: openWhatsNewModalFn } = useWhatsNewModal()

async function openWhatsNewModal() {
  openWhatsNewModalFn()

  const contentAmount = await queryContent().count()

  if (hasUnreadContent.value) {
    lastSavedContentCount.value = contentAmount
  }
}
</script>

<template>
  <div class="bg-white h-full">
    <Navbar class="bg-slate-800">
      <A href="/app/" class="text-lg font-bold text-teal-500 flex items-center">
        Thal
      </A>

      <div>
        <Button
          class="btn-ghost"
          size="md"
          shape="circle"
          no-disable-on-loading
          :class="{
            'text-primary': hasUnreadContent,
            'text-slate-600': !hasUnreadContent,
          }"
          :loading="countQuery.isLoading.value"
          @click="openWhatsNewModal"
        >
          <Icon v-show="!countQuery.isLoading.value" name="news" />
        </Button>

        <ChatListOptionsButton />
      </div>
    </Navbar>

    <div v-show="isNoteVisible" class="bg-slate-200 px-3 py-4 flex items-center justify-between w-min-full">
      <div class="flex items-center gap-2">
        <div>
          <div class="p-2 flex items-center justify-center">
            <Icon name="waving_hand" class="text-primary" />
          </div>
        </div>

        <div class="flex flex-col">
          <h2 class="text-lg text-slate-800">
            Welcome!
          </h2>
          <p class="text-sm text-slate-800">
            Every conversation is a step closer to your goals.
          </p>
        </div>

        <div>
          <button class="btn btn-md btn-ghost btn-circle" @click="isNoteVisible = false">
            <Icon name="close" class="text-primary" />
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 py-2">
      <SearchField
        :placeholder="t('Search name or username...')"
        path="search"
      />
    </div>

    <div class="flex-1 overflow-y-auto bg-white">
      <ChatListEmpty v-if="!chats?.length && !chatItemSearch.trim()" />

      <template v-else-if="!chats?.length">
        <p class="text-slate-500 text-sm py-2 px-6 text-center">
          {{ chatItemSearch ? t(`No results found for "{query}"`, { query: chatItemSearch }) : t('No results found.') }}
        </p>
      </template>

      <template v-else>
        <ChatItem
          v-for="chat in chats"
          :key="chat.chatId"
          :chat="chat"
          @click="emit('close')"
        />
      </template>
    </div>

    <div class="absolute bottom-4 right-4">
      <Button size="md" class="btn-circle btn-primary" @click="drawers.newChat = true">
        <Icon name="add" />
      </Button>
    </div>
  </div>
</template>
