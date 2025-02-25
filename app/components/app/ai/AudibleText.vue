<script setup lang="ts">
import { useI18n } from '@psitta/vue'
import { useMutation } from '@tanstack/vue-query'
import { currentPlayingMessage } from '~/store'

const props = defineProps<{
  text: string
}>()
const { t } = useI18n()
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
  onError: () => toast.error(t('Error synthesizing voice.')),
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
        span.classList.add('text-gradient-4')
      }
      else {
        span.classList.remove('text-gradient-4')
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
    {{ currentPlayingMessage }}
    <MDC
      :value="text"
      tag="article"
      class="prose"
    />
  </div>
</template>

<style>
.text-gradient-4 {
  background: linear-gradient(66deg, theme('colors.red.500'), theme('colors.magenta.500'));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
