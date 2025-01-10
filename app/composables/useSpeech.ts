interface Synthesis {
  audioUrl: string
  timepoints: { markName: string, timeSeconds: number }[]
}

const NON_PLAYING = -1

function useSpeech(text: string) {
  const currentWord = ref(NON_PLAYING)

  const audio = ref<HTMLAudioElement | null>(null)
  const synthesis = ref<Synthesis | null>(null)
  const timers = ref<number[]>([])
  const isPlaying = ref(false)
  const isError = ref(false)

  const synthesize = async () => {
    try {
      const res = await $fetch('/api/synthesizeSpeech', {
        method: 'post',
        body: { text },
      })

      const audioBase64 = res.audioContent
      const byteCharacters = atob(audioBase64)
      const byteArray = Uint8Array.from(byteCharacters, c => c.charCodeAt(0))
      const audioBlob = new Blob([byteArray], { type: 'audio/mp3' })

      const audioUrl = URL.createObjectURL(audioBlob)
      const timepoints = res.timepoints.map((tp: { timeSeconds: number, markName: string }) => ({
        ...tp,
        timeSeconds: Number.parseFloat(tp.timeSeconds.toFixed(3)), // Normalize precision
      }))

      synthesis.value = { audioUrl, timepoints }
    }
    catch (e) {
      const _ = e
      isError.value = true
      synthesis.value = null
    }
  }

  const stop = () => {
    if (audio.value) {
      audio.value.pause()
      audio.value.currentTime = NON_PLAYING
      audio.value = null
    }

    isPlaying.value = false
    currentWord.value = NON_PLAYING
    timers.value.forEach(clearTimeout)
  }

  const play = async () => {
    if (isPlaying.value)
      stop()

    if (!synthesis.value)
      return

    isError.value = false
    currentWord.value = NON_PLAYING

    const { audioUrl, timepoints } = synthesis.value

    const player = new Audio(audioUrl)
    audio.value = player

    try {
      await player.play()
      isPlaying.value = true

      timepoints.forEach((tp, index) => {
        const timerId = setTimeout(() => {
          currentWord.value = index
        }, tp.timeSeconds * 1000)
        timers.value.push(timerId as unknown as number)
      })

      player.onended = () => {
        stop()
      }

      player.onerror = () => {
        isError.value = true
        stop()
      }
    }
    catch (e) {
      const _ = e
      isError.value = true
      stop()
    }
  }

  const hasDataFetched = computed(() => !!synthesis.value)

  return { stop, play, isPlaying, currentWord, synthesize, hasDataFetched }
}

export default useSpeech
