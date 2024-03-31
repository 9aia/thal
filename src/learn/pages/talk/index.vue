<script setup lang="ts">
import { useI18n } from '@psitta/vue';
import { useAsyncState, useDevicesList, useUserMedia } from '@vueuse/core';
import { tv } from 'tailwind-variants';

definePageMeta({
  middleware: 'premium',
  layout: 'app',
})

const toast = useToast()
const { t } = useI18n()

const expected = ref("I'm trying")
const score = ref<number>(0)

const { audioInputs, ensurePermissions } = useDevicesList()
const currentMicrophone = computed(() => audioInputs.value[0]?.deviceId)

const mic = useUserMedia({
  constraints: {
    audio: { deviceId: currentMicrophone.value, }
  }
})

const requestMicPermission = async () => {
  try {
    await ensurePermissions()
  } catch (err) {
    const error = err as any

    switch (error.name) {
      case 'NotAllowedError':
        toast.error(t('Permission not allowed'))
        break
      case 'NotFoundError':
        toast.error(t('Microphone not found'))
        break
      default:
        toast.error(t('Permission error'))
        break
    }
  }
}

const handleStartRecording = async () => {
  await requestMicPermission()

  const stream = await mic.start()

  const recorder = new MediaRecorder(stream!)
  recorder.start()

  recorder.ondataavailable = async (e) => {
    const audioBlob = new Blob([e.data], { type: 'audio/webm' })

    await transcribing.execute(0, audioBlob)

    rateSpeech()
  }
}

const transcribing = useAsyncState(async (audioBlob: Blob) => {
  return await $fetch('/api/transcribe', {
    method: 'post',
    body: {
      audio: await getBase64(audioBlob)
    }
  })
}, undefined, {
  immediate: false,
})

const transcription = computed(() => {
  if (!transcribing.state.value) {
    return
  }

  const data = transcribing.state.value;
  const results = data.results

  return {
    spoke: !!data.results,
    best: {
      transcript: results?.[0].alternatives[0].transcript,
      confidence: results?.[0].alternatives[0].confidence,
    }
  }
})

const handleStopRecording = () => mic.stop()

const handleMicClick = () => {
  if (mic.enabled.value) {
    handleStopRecording()
  } else {
    handleStartRecording()
  }
}

const btnStyles = tv({
  base: 'rounded',
  variants: {
    type: {
      recording: 'bg-red-500 hover:bg-red-700',
      notRecording: 'bg-teal-500 hover:bg-teal-700',
    }
  }
})

const ipa = ref("")

const generateIpa = async () => {
  try {
    const text = transcription.value?.best?.transcript

    const data = await $fetch('/api/ipa', {
      method: 'POST',
      body: {
        text: text,
      }
    })

    ipa.value = data.transcript;
  } catch (e) {
    toast.error('Error generating IPA.')
    return;
  }
}

const rateSpeech = async () => {
  try {
    const expect = expected.value
    const spoke = transcription.value?.best?.transcript

    const data = await $fetch('/api/rateSpeech', {
      method: 'POST',
      body: {
        spoke,
        expected: expect,
      }
    })

    score.value = data.score;
  } catch (e) {
    toast.error('Error generating IPA.')
    return;
  }
}
</script>

<template>
  <div class="px-4 py-4">
    <div>
      <p>Speak the text: {{expected}}</p>
    </div>

    <Btn :class="btnStyles({ type: mic.enabled.value ? 'recording' : 'notRecording' })"
      :loading="transcribing.isLoading.value" @click="handleMicClick">
      <Icon v-if="!mic.enabled.value">mic</Icon>
      <Icon v-else>graphic_eq</Icon>
    </Btn>

    <div v-if="transcription">
      <template v-if="transcription.spoke">
        <p>Transcript: {{ transcription.best.transcript }}</p>
        <p>Confidence: {{ transcription.best.confidence }}</p>

        <p>Score: {{ score }}</p>
      </template>
      <template v-else>
        <p>{{ t("You didn't speak, try again!") }}</p>
      </template>
    </div>
  </div>
</template>
