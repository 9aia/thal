import { useAsyncState, useDevicesList, useUserMedia } from '@vueuse/core'

const toast = useToast()

function useTranscription(text: MaybeRef) {
  const { t } = useI18nExperimental()

  const { audioInputs } = useDevicesList({
    requestPermissions: true,
    constraints: {
      audio: true,
      video: false,
    },
  })

  const currentMic = computed(() => audioInputs.value[0]?.deviceId)

  const mic = useUserMedia({
    constraints: {
      audio: { deviceId: currentMic.value },
    },
  })

  const transcription = useAsyncState(async (audioBlob) => {
    const transcribe = await $fetch('/api/transcribe', {
      method: 'post',
      body: {
        audio: await getBase64(audioBlob),
      },
    })

    const bestTranscription = transcribe.results?.[0].alternatives?.[0]
    const transcript = bestTranscription?.transcript
    const confidence = bestTranscription?.confidence

    const rateSpeench = await $fetch('/api/rateSpeech', {
      method: 'POST',
      body: {
        transcript,
        expected: text,
      },
    })

    return {
      score: rateSpeench.score,
      transcript,
      confidence,
    }
  }, undefined, {
    immediate: false,
    onError() {
      toast.error('Something went wrong.')
    },
  })

  const startRecording = async () => {
    let stream: MediaStream | undefined

    try {
      stream = await mic.start()
    }
    catch (err) {
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

      return
    }

    const recorder = new MediaRecorder(stream!)
    recorder.start()

    recorder.ondataavailable = async (e) => {
      const audioBlob = new Blob([e.data], { type: 'audio/webm' })

      await transcription.execute(0, audioBlob)
    }
  }

  const stopRecording = () => mic.stop()

  const isRecording = computed(() => mic.enabled.value)

  const toggleRecording = () => {
    if (mic.enabled.value)
      stopRecording()
    else
      startRecording()
  }

  const isLoading = computed(() => transcription.isLoading.value)
  const state = computed(() => transcription.state.value)
  const error = computed(() => transcription.error.value)

  return {
    error,
    state,
    isLoading,
    isRecording,
    toggleRecording,
  }
}

export default useTranscription
