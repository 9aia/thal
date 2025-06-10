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
      <p v-if="!chatListSearch.trim()" class="text-gray-500 text-xs px-2 py-2">
        {{ t('You have no chats yet.') }}
      </p>

      <p v-else class="text-gray-500 text-xs py-2">
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
