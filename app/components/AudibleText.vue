<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import { useToast } from "~~/layers/ui/composables/useToast"

const props = defineProps<{
  text: string
}>()
const { t } = useI18n()
const toast = useToast()

const loading = ref(false)
const speech = useSpeech(props.text)

async function play() {
  try {
    loading.value = true
    await speech.synthesize()
  }
  catch (e) {
    toast.error(t("Error synthesizing voice."))
    return
  }
  finally {
    loading.value = false
  }

  speech.play()
}
</script>

<template>
  <button :loading="loading" class="flex items-center" @click="play">
    <Icon>volume_up</Icon>
    <SpeechHighlight :text="props.text" :current-word="speech.currentWord.value" />
  </button>
</template>
