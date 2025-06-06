<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  replyingId: number
  replyMessage: string
  replyFrom: 'user' | 'bot'
  username: string
}>()

const { t } = useI18nExperimental()

function highlightBubble(bubble: any) {
  // Reset animation
  bubble.style.animation = 'none'

  bubble.offsetHeight
  bubble.style.animation = ''

  // Add animation class
  bubble.classList.add('animate-highlight')
}

function scrollToMessage() {
  const message = document.querySelector(`#bubble-container-${props.replyingId}`)
  if (!message)
    return

  message.scrollIntoView({ behavior: 'smooth' })

  const bubble = message.querySelector('.chat-bubble-bg') as any
  if (!bubble)
    return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        highlightBubble(bubble)
        observer.disconnect()
      }
    },
    { threshold: 0.5 },
  )
  observer.observe(bubble)
}

const queryClient = useQueryClient()

const data = computed(() => queryClient.getQueryData(queryKeys.chat(props.username)))
const { displayName } = useContactInfo(data)

const replyDisplayName = computed(() => props.replyFrom === 'user'
  ? t('You')
  : displayName.value,
)

const replyMessage = computed(() => trimReplyMessage(props.replyMessage))
</script>

<template>
  <div
    class="rounded-2xl bg-gradient-1 py-1 px-3 relative w-full overflow-hidden pb-4" role="button"
    @click="scrollToMessage"
  >
    <div class="flex items-center gap-1 text-xs text-blue-500">
      <Icon name="material-symbols:reply" class="text-sm" />
      {{ t('Replying to') }}
    </div>

    <h3 class="text-sm text-blue-500">
      {{ replyDisplayName }}
    </h3>

    <MDC :value="replyMessage" tag="article" class="text-xs text-blue-500 line-clamp-3 prose prose-slate prose-sm" />
  </div>
</template>

<style scoped>
.bg-gradient-1 {
  background: radial-gradient(at bottom, var(--color-blue-50), var(--color-gray-50));
}
</style>
