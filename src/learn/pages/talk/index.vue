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

const { audioInputs, ensurePermissions } = useDevicesList()
const currentMicrophone = computed(() => audioInputs.value[0]?.deviceId)

const mic = useUserMedia({
  constraints: {
    audio: { deviceId: currentMicrophone.value, }
  }
})

function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const requestMicPermission = async () => {
  try {
    await ensurePermissions()
  } catch(err) {
    const error = err as any

    switch(error.name) {
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

const transcribeResult = computed(() => {
  if(!transcribing.state.value) {
    return
  }

  return transcribing.state.value.alternatives[0]
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
</script>

<template>
  <div>
    <Btn
      :class="btnStyles({ type: mic.enabled.value ? 'recording' : 'notRecording' })"
      :loading="transcribing.isLoading.value"
      @click="handleMicClick"
    >
      <Icon v-if="!mic.enabled.value">mic</Icon>
      <Icon v-else>graphic_eq</Icon>
    </Btn>

    <div v-if="transcribeResult">
      <p>Transcript: {{ transcribeResult.transcript }}</p>
      <p>Confidence: {{ transcribeResult.confidence }}</p>
    </div>
  </div>
</template>
