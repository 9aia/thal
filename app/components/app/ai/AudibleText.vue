<script setup lang="ts">
import { useMutation } from '@tanstack/vue-query'
import { RateLimitError } from '~/composables/useSpeech'
import { currentPlayingMessage } from '~/store'

const props = defineProps<{
  text: string
}>()
const { t } = useI18nExperimental()
const toast = useToast()

const el = ref<HTMLElement | null>(null)

function getTtsData(element: Element) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(element.innerHTML, 'text/html')

  const elements = doc.querySelectorAll('[data-tts]')

  const values = Array.from(elements).map(element => element.textContent?.trim())

  return values.join(' ')
}

const textToSpeech = computed(() => {
  const html = getTtsData(el.value!)

  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
})

const speech = useSpeech(textToSpeech)

const playMutation = useMutation({
  mutationFn: async () => {
    if (!speech.hasDataFetched.value) {
      await speech.synthesize()
    }

    speech.play()
    currentPlayingMessage.value = props.text
  },
  onError: async (e) => {
    if (e instanceof RateLimitError) {
      toast.error(t('You are requesting speech synthesis too much. Please wait a moment.'))
      return
    }

    toast.error(t('Error synthesizing voice.'))
  },
})

watch(currentPlayingMessage, (value) => {
  if (value !== props.text) {
    speech.stop()
  }
})

const currentWord = computed(() => speech.currentWord.value)

watch(currentWord, () => {
  if (el.value) {
    const spans = el.value.querySelectorAll('span[data-tts]')

    spans.forEach((span, i) => {
      if (i === currentWord.value) {
        span.classList.add(...('text-gradient bg-linear-[66deg] from-magenta-500 to-red-500'.split(' ')))
      }
      else {
        span.classList.remove(...('text-gradient bg-linear-[66deg] from-magenta-500 to-red-500'.split(' ')))
      }
    })
  }
})

defineExpose({
  playMutation,
})
</script>

<template>
  <div ref="el">
    <MDC
      :key="text"
      :value="text"
      tag="article"
      class="prose"
    />
  </div>
</template>
