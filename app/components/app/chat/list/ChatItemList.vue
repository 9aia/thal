<script setup lang="ts">
import { t } from '@psitta/vue'
import queryKeys from '~/queryKeys'
import { chatListSearch, isRootDrawerOpen } from '~/store'

const localWithDefaultRegion = useLocaleDefaultRegion()

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

function openChat(username: string) {
  isRootDrawerOpen.value = false
  navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <CommonResource :for="chatsQuery">
    <template #empty>
      <ChatListEmpty v-if="!chatListSearch.trim()" />

      <p v-else class="text-gray-500 text-sm py-2 px-6 text-center">
        {{ chatListSearch ? t(`No results found for "{query}"`, { query: chatListSearch }) : t('No results found.') }}
      </p>
    </template>

    <template #default>
      <ChatItem
        v-for="chat in chatsQuery.data.value"
        :key="chat.chatId"
        :chat="chat"
        @click="openChat(chat.username)"
      />
    </template>
  </CommonResource>
</template>
