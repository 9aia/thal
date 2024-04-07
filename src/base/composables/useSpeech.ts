import { useI18n } from "@psitta/vue";

interface Synthesis {
  audioUrl: string
  timepoints: { markName: string; timeSeconds: number }[]
}

function useSpeech(text: string) {  
  const currentWord = ref(-1)
  const timers = ref<number[]>([])

  const playing = ref(false)
  const audio = ref<HTMLAudioElement>()
  const synthesis = ref<Synthesis>()
  
  const synthesize = async () => {
    const res = await $fetch('/api/synthesizeSpeech', {
      method: 'post',
      body: {
        text
      }
    })
  
    const audioBase64 = res.audioContent;
    const byteCharacters = atob(audioBase64);
    const byteArray = Uint8Array.from(byteCharacters, c => c.charCodeAt(0));
    const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });
  
    const audioUrl = URL.createObjectURL(audioBlob);
    const timepoints = [...res.timepoints, { timeSeconds: 1 }]
  
    synthesis.value = { audioUrl, timepoints };
  }
  
  const stop = () => {
    audio.value?.pause()
    playing.value = false
  }
  
  const play = async () => {
    if (playing.value) {
      stop()
    }
    
    if (!synthesis.value) {
      return;
    }

    const synth = synthesis.value
  
    const player = new Audio();
    player.src = synth.audioUrl;
    player.play();
  
    for (let timerId of timers.value) {
      clearTimeout(timerId)
    }
  
    currentWord.value = -1
  
    for (let point of synth.timepoints) {
      const timerId = setTimeout(() => {
        currentWord.value++
      }, point.timeSeconds * 1000)
  
      timers.value.push(timerId as unknown as number)
    }
  
    audio.value = player;
  
    playing.value = true;
  }

  return { stop, play, playing, currentWord, synthesize }
}

export default useSpeech
