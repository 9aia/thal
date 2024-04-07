<script setup lang="ts">
import { useI18n } from '@psitta/vue';

const { t } = useI18n()
const toast = useToast()

const props = defineProps<{
  text: string
}>()

const loading = ref(false)
const speech = useSpeech(props.text)

const play = async () => {
  try {
    loading.value = true
    await speech.synthesize()
  } catch (e) {
    toast.error(t('Error synthesizing voice.'))
    return;
  } finally {
    loading.value = false
  }
  
  speech.play()
}
</script>

<template>
  <button @click="play" :loading="loading" class="flex items-center">
    <Icon>volume_up</Icon>
    <SpeechHighlight :text="props.text" :current-word="speech.currentWord.value" />
  </button>
</template>