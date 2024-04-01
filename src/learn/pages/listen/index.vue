<script setup lang="ts">
import { useI18n } from '@psitta/vue';

const { t } = useI18n() 
const toast = useToast()

const text = ref("My name is Maria!")

const loading = ref(false)
const playing = ref(false)
const audio = ref<HTMLAudioElement>()
const audioUrl = ref<string>()

const synthesize = async () => {
  const res = await $fetch('/api/synthesizeSpeech', {
    method: 'post',
    body: {
      text: text.value
    }
  })

  const audioBase64 = res.audioContent;
  const byteCharacters = atob(audioBase64);
  const byteArray = Uint8Array.from(byteCharacters, c => c.charCodeAt(0));
  const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });

  const audioUrl = URL.createObjectURL(audioBlob);

  return audioUrl;
}

const stop = () => {
  audio.value?.pause()
  playing.value = false
}

const play = async () => {
  if (playing.value) {
    stop()
  }

  if (!audioUrl.value) {
    loading.value = true;
    
    try {
      audioUrl.value = await synthesize();
    } catch (e)  {
      toast.error(t('Error synthesizing voice.'))
      return;
    } finally {
      loading.value = false;
    }
  }

  const player = new Audio();
  player.src = audioUrl.value;
  player.play();
  
  audio.value = player;

  playing.value = true;
}
</script>

<template>
  <div class="px-4 py-4">

    <Btn @click="play" :loading="loading">
      {{ text }}
      <Icon>volume_up</Icon>
    </Btn>
  </div>
</template>
