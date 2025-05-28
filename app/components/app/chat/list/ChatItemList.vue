<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { t } from '@psitta/vue'
import queryKeys from '~/queryKeys'
import { chatListSearch, isRootDrawerOpen } from '~/store'

const localWithDefaultRegion = useLocaleDefaultRegion()

const {
  data: chats,
  isPending,
  isError,
  refetch,
} = useServerQuery(`/api/chat?search=${chatListSearch.value}&locale=${localWithDefaultRegion.value}` as `/api/chat`, {
  queryKey: queryKeys.chatsSearch(localWithDefaultRegion.value, chatListSearch),
})

function openChat(username: string) {
  isRootDrawerOpen.value = false
  navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <StyledResource
    :loading="isPending"
    :error="isError"
    @execute="refetch"
  >
    <ChatListEmpty v-if="!chats?.length && !chatListSearch.trim()" />

    <template v-else-if="!chats?.length">
      <p class="text-gray-500 text-sm py-2 px-6 text-center">
        {{ chatListSearch ? t(`No results found for "{query}"`, { query: chatListSearch }) : t('No results found.') }}
      </p>
    </template>

    <template v-else>
      <ChatItem
        v-for="chat in chats"
        :key="chat.chatId"
        :chat="chat"
        @click="openChat(chat.username)"
      />
    </template>
  </StyledResource>
</template>
