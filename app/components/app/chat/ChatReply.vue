<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query"
import { useI18n } from "@psitta/vue"
import queryKeys from "~/queryKeys"

const props = defineProps<{
  replyingId: number
  replyMessage: string
  replyFrom: "user" | "bot"
  username: string
}>()

const { t } = useI18n()

function highlightBubble(bubble: any) {
  // Reset animation
  bubble.style.animation = "none"
  // eslint-disable-next-line no-unused-expressions
  bubble.offsetHeight
  bubble.style.animation = ""

  // Add animation class
  bubble.classList.add("animate-highlight")
}

function scrollToMessage() {
  const message = document.querySelector(`#bubble-container-${props.replyingId}`)
  if (!message)
    return

  message.scrollIntoView({ behavior: "smooth" })

  const bubble = message.querySelector(".bubble") as any
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

const replyDisplayName = computed(() => props.replyFrom === "user"
  ? t("You")
  : displayName.value,
)

const replyMessage = computed(() => trimReplyMessage(props.replyMessage))
</script>

<template>
  <div
    class="rounded-2xl bg-slate-100 py-1 px-3 relative w-full overflow-hidden"
    role="button"
    @click="scrollToMessage"
  >
    <div class="w-1 bg-teal-500 h-full absolute top-0 left-0" />

    <h3 class="text-sm font-medium text-teal-600">
      {{ replyDisplayName }}
    </h3>
    <p class="text-xs text-slate-600 line-clamp-3">
      <MDC
        :value="replyMessage"
        tag="article"
        class="prose prose-slate prose-sm"
      />
    </p>
  </div>
</template>
