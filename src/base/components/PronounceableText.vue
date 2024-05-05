<script setup lang="ts">
import { useI18n } from '@psitta/vue';
import { tv } from 'tailwind-variants';

const props = defineProps<{
  text: string
}>()

const emit = defineEmits<{
  (
    e: 'result',
    state: typeof pronounce.state.value,
  ): void
}>()

const { t } = useI18n()

const pronounce = useTranscription(props.text)

watch(() => pronounce.isLoading.value, (value) => {
  if (value || pronounce.error.value) {
    return
  }

  emit('result', pronounce.state.value)
})

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
  <div class="px-4 py-4">
    <div>
      <p>Speak the text: {{text}}</p>
    </div>

    <Btn
      :class="btnStyles({ type: pronounce.isRecording.value ? 'recording' : 'notRecording' })"
      :loading="pronounce.isLoading.value"
      @click="pronounce.toggleRecording"
    >
      <Icon v-if="!pronounce.isRecording.value">mic</Icon>
      <Icon v-else>graphic_eq</Icon>
    </Btn>

    <div v-if="!pronounce.isLoading.value && pronounce.state.value">
      <p>Score: {{ pronounce.state.value.score }}</p>
    </div>

    <template v-else>
      <p>{{ t("You didn't speak, try again!") }}</p>
    </template>
  </div>
</template>
