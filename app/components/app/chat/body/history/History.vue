<script setup lang="ts">
import { useOnline } from '@vueuse/core'

const route = useRoute()
const username = computed(() => route.params.username as string)

const isOnline = useOnline()
const sendMessageMutation = useSendMessage(username)

const historyQuery = useHistoryQuery(username)
await historyQuery.suspense()

const showShowChatBubbleLoading = computed(() => {
  return sendMessageMutation.isPending.value && isOnline.value
})

const { scrollBottom } = useChatMainScroll()

watch(showShowChatBubbleLoading, () => {
  setTimeout(() => {
    scrollBottom()
  }, 300)
})
</script>

<template>
  <CommonResource
    :for="historyQuery"
    common-error-fallback-class="px-6 mt-8"
    centered-error-fallback
  >
    <template #empty>
      <span />
    </template>

    <template #default>
      <div class="space-y-2 relative">
        <TransitionGroup name="fade-bubble">
          <template v-for="(item, index) in historyQuery.data.value" :key="`bubble-${index}`">
            <ChatBubble
              :id="item.id"
              :status="item.status"
              :content="item.content"
              :time="item.time"
              :from="item.from"

              :in-reply-to="item.inReplyTo ? { ...item.inReplyTo } : undefined"
              :is-last="index === (historyQuery.data.value!.length - 1)"
            />
          </template>

          <ChatBubbleLoading v-if="showShowChatBubbleLoading" class="mt-6 pb-6" />
        </TransitionGroup>
      </div>
    </template>
  </CommonResource>
</template>

<style>
/* 1. declare transition */
.fade-bubble-move,
.fade-bubble-enter-active,
.fade-bubble-leave-active {
  transition: all 300ms ease-in-out;
}

/* 2. declare enter from and leave to state */
.fade-bubble-enter-from,
.fade-bubble-leave-to {
  opacity: 0;
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-bubble-leave-active {
  position: absolute;
}
</style>
