<script setup lang="ts">
import { t } from '@psitta/vue'
import queryKeys from '~/queryKeys'
import { isChatListDrawerOpen, openContactView } from '~/store'
import { MessageStatus } from '~~/db/schema'

const props = defineProps<{
  username: string
  lastMessage?: {
    datetime: number
    status: MessageStatus
    content: string
  }
}>()

const characterQuery = useCharacterQuery(toRef(props, 'username'))

const headers = useRequestHeaders(['cookie'])
const contactQuery = useServerQuery({
  queryKey: queryKeys.contact(toRef(props, 'username')),
  queryFn: () => $fetch(`/api/contact/${props.username}` as `/api/contact/:username`, {
    headers,
  }),
})

const contactNames = computed(() => getContactName({
  username: props.username,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))

const content = computed(() => {
  return props.lastMessage?.content || ''
})

async function handleGoToChat(username: string) {
  isChatListDrawerOpen.value = false
  await navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <div
    role="button"
    class="group px-2 py-2 flex items-center justify-center gap-3 cursor-pointer rounded-2xl focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-500 "
    @click="handleGoToChat(username)"
  >
    <Avatar
      :name="contactNames.avatarName"
      size="md"
      wrapper-class="bg-gray-50 text-neutral-content"
      type="button"
      @click.stop.prevent="openContactView(username)"
    />

    <div
      class="flex-1 flex flex-col justify-center w-10px focus:outline-none"
      tabindex="0"
      @click="handleGoToChat(username)"
    >
      <div class="flex justify-between items-center">
        <a class="block text-base text-gray-800">
          {{ contactNames.displayName }}
        </a>

        <ClientOnly v-if="lastMessage">
          <ChatItemTime :datetime="lastMessage.datetime" />
        </Clientonly>
      </div>

      <div
        v-if="lastMessage"
        class="text-sm text-gray-600 flex items-center gap-0.5"
      >
        <div
          v-if="lastMessage.status === MessageStatus.sending"
          class="line-clamp-1 text-green-500"
          :class="{ invisible: !lastMessage.content }"
        >
          {{ t('Typing...') }}
        </div>

        <template v-else>
          <MessageIcon
            v-if="lastMessage.content && lastMessage.status"
            :status="lastMessage.status"
          />

          <div class="line-clamp-1" :class="{ invisible: !content }">
            {{ content || '-' }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
