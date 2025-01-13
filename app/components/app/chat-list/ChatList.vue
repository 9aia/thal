<script setup lang="ts">
import { t } from '@psitta/vue'
import { useQuery } from '@tanstack/vue-query'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { chatItemSearch, drawers } from '~/store'

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
  isPending,
  isError,
  refetch,
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
    <Navbar class="bg-black">
      <A href="/app/" class="text-lg text-black flex items-center">
        Thal
      </A>

      <div>
        <Button
          class="btn-ghost"
          size="md"
          shape="circle"
          no-disable-on-loading
          :class="{
            'text-red-500': hasUnreadContent,
            'text-black': !hasUnreadContent,
          }"
          :loading="countQuery.isLoading.value"
          @click="openWhatsNewModal"
        >
          <Icon v-show="!countQuery.isLoading.value" name="news" />
        </Button>

        <ChatListOptionsButton />
      </div>
    </Navbar>

    <div v-show="isNoteVisible" class="bg-gradient-1 px-3 py-2 flex items-center justify-between w-min-full">
      <div class="flex items-center gap-2 w-full">
        <div>
          <div class="p-2 flex items-center justify-center">
            <Icon name="waving_hand" class="text-gray-800" />
          </div>
        </div>

        <div class="flex flex-col w-full">
          <h2 class="text-lg text-gradient-1 w-fit">
            {{ t('Welcome!') }}
          </h2>
        </div>

        <div>
          <button class="btn btn-md btn-ghost btn-circle" @click="isNoteVisible = false">
            <Icon name="close" class="text-gray-800" />
          </button>
        </div>
      </div>
    </div>

    <div v-if="chats?.length" class="px-4 py-2">
      <SearchField
        :placeholder="t('Search name or username...')"
        path="search"
      />
    </div>

    <div class="flex-1 overflow-y-auto bg-white">
      <StyledResource
        :loading="isPending"
        :error="isError"
        @execute="refetch"
      >
        <ChatListEmpty v-if="!chats?.length && !chatItemSearch.trim()" />

        <template v-else-if="!chats?.length">
          <p class="text-gray-500 text-sm py-2 px-6 text-center">
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
      </StyledResource>
    </div>

    <div class="absolute bottom-4 right-4">
      <Button size="md" class="btn-circle border-none bg-cyan-500" @click="drawers.newChat = true">
        <Icon name="add" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: linear-gradient(50deg, theme('colors.magenta.500'), theme('colors.red.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
