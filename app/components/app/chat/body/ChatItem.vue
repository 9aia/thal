<script setup lang="ts">
import { t } from '@psitta/vue'
import { isRootDrawerOpen } from '~/store'
import type { ChatItem } from '~/types'

const props = defineProps<{
  chat: Readonly<ChatItem>
}>()

const contactInfo = computed(() => ({
  name: props.chat.characterName,
  username: props.chat.username,
  contact: {
    name: props.chat.contactName,
  },
}))

const { displayName } = useContactInfo(contactInfo)

const content = computed(() => {
  return props.chat.lastMessageContent || ''
})

async function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false
  await navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <div role="button" class="px-3 py-1 hover:bg-gradient-1 flex gap-2" @click="handleGoToChat(chat.username)">
    <Avatar
      :name="chat.characterName"
      class="mt-2 mx-auto"
      size="sm"
      wrapper-class="bg-neutral text-neutral-content"
      type="button"
    />

    <div class="flex-1 flex flex-col justify-center w-10px">
      <div class="flex justify-between items-center">
        <a class="block text-base text-gray-800">{{ displayName }}</a>

        <ClientOnly v-if="content">
          <ChatItemTime :chat="chat" />
        </Clientonly>
      </div>

      <div
        class="text-sm text-gray-600 flex items-center gap-0.5"
      >
        <div v-if="chat.lastMessageStatus === 'seen'" class="line-clamp-1 text-green-500" :class="{ invisible: !chat.lastMessageContent }">
          {{ t('Typing...') }}
        </div>

        <template v-else>
          <MessageIcon
            v-if="chat.lastMessageContent && chat.lastMessageStatus"
            :status="chat.lastMessageStatus"
          />

          <div class="line-clamp-1" :class="{ invisible: !content }">
            {{ content || '-' }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover\:bg-gradient-1:hover {
  background: radial-gradient(circle, var(--color-magenta-50), var(--color-white));
}
</style>
