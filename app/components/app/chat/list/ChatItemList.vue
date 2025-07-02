<script setup lang="ts">
import { t } from '@psitta/vue'
import { chatListSearch } from '~/store'

const chatsQuery = useChatsQuery()
const sidebar = useSidebar()

function openChat(username: string) {
  sidebar.open.value = false
  navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <CommonResource :for="chatsQuery">
    <template #empty>
      <p v-if="!chatListSearch?.trim()" class="text-gray-500 text-xs px-2 py-2">
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
        :username="chat.username"
        :last-message="chat.lastMessageDatetime ? {
          datetime: chat.lastMessageDatetime!,
          status: chat.lastMessageStatus!,
          content: chat.lastMessageContent!,
        } : undefined"
        @click="openChat(chat.username)"
      />
    </template>
  </CommonResource>
</template>
