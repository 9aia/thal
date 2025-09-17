<script setup lang="ts">
import type { InReplyTo } from '~~/db/schema'

const props = defineProps<{
  is: InReplyTo
  username: string
}>()

const { t } = useI18nExperimental()

const contactQuery = useContactQuery(toRef(props, 'username'))
const characterQuery = useCharacterQuery(toRef(props, 'username'))

const promises = [
  contactQuery.suspense(),
  characterQuery.suspense(),
]

await Promise.all(promises)

const contactNames = computed(() => getContactName({
  username: props.username,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))

const replyDisplayName = computed(() => props.is.from === 'user'
  ? t('You')
  : contactNames.value.displayName,
)

const replyMessage = computed(() => trimReplyMessage(props.is.content))

function highlightBubble(bubble: any) {
  // Reset animation
  bubble.style.animation = 'none'

  bubble.offsetHeight
  bubble.style.animation = ''

  // Add animation class
  bubble.classList.add('animate-highlight')
}

function scrollToMessage() {
  const message = document.querySelector(`#bubble-container-${props.is.id}`)
  if (!message)
    return

  message.scrollIntoView({ behavior: 'smooth' })

  const bubble = message.querySelector('.chat-bubble-bg') as any
  if (!bubble)
    return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        highlightBubble(bubble)
        observer.disconnect()
      }
    },
    { threshold: 0.5 },
  )
  observer.observe(bubble)
}
</script>

<template>
  <div
    class="flex flex-col justify-center items-end w-full px-2 max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]"
  >
    <div
      class="flex items-center gap-1 text-xs text-blue-500 mb-1 pr-4 cursor-pointer"
      role="button"
      @click="scrollToMessage"
    >
      <Icon name="material-symbols:reply-rounded" class="text-xs" />
      {{ t('Replying to') }}
    </div>

    <div
      class="rounded-3xl bg-radial-[at_bottom] from-blue-50 to-gray-50 px-4 py-4 relative w-full overflow-hidden cursor-pointer"
      role="button"
      @click="scrollToMessage"
    >
      <h3 class="text-sm text-blue-500 mb-1">
        {{ replyDisplayName }}
      </h3>

      <MDC :value="replyMessage" tag="article" class="text-xs text-blue-500 line-clamp-3 prose prose-slate prose-sm" />
    </div>
  </div>
</template>
