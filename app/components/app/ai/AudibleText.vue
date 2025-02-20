<script setup lang="ts">
import { useI18n } from '@psitta/vue'
import { useMutation } from '@tanstack/vue-query'

const props = defineProps<{
  text: string
}>()
const { t } = useI18n()
const toast = useToast()

const speech = useSpeech(props.text)

const playMutation = useMutation({
  mutationFn: async () => {
    if (!speech.hasDataFetched.value) {
      await speech.synthesize()
    }

    speech.play()
  },
  onError: () => toast.error(t('Error synthesizing voice.')),
})

const currentWord = computed(() => speech.currentWord.value)
const el = ref<HTMLElement | null>(null)

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
    <MDC :value="text" tag="article" class="prose" />
  </div>
</template>

<style>
.text-gradient-4 {
  background: linear-gradient(66deg, theme('colors.red.500'), theme('colors.magenta.500'));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
