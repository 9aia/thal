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

const textParts = computed(() => {
  const text = props.text.trim()
  return text.split(/\s+/)
})

defineExpose({
  playMutation,
})
</script>

<template>
  <article class="text-sm text-gray-700 text-left">
    <span v-for="part, j in textParts" :key="j" :class="{ 'text-gradient-4': j === currentWord }">
      {{ ' ' }}
      {{ part }}
    </span>
  </article>
</template>

<style scoped>
.text-gradient-4 {
  background: linear-gradient(#f0f, #f00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
