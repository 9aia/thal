<script setup lang="ts">
import { diffWords } from 'diff'
import type { MessageCorrectionData } from '~~/shared/types'

const props = defineProps<{
  originalText: string
  messageCorrection?: MessageCorrectionData
  correctedText: string
  messageId: number
}>()

const emit = defineEmits<{
  (e: 'openMessageCorrectionModal', text: string): void
}>()

interface DiffPart {
  type: 'delete' | 'equal'
  text: string
}

const diffParts = computed(() => {
  if (!props.originalText || !props.correctedText)
    return [{ type: 'equal', text: props.originalText }] satisfies DiffPart[]

  const diffs = diffWords(props.originalText, props.correctedText)

  const parts: DiffPart[] = []

  for (const part of diffs) {
    if ((part as any).added)
      continue
    if ((part as any).removed)
      parts.push({ type: 'delete', text: part.value })
    else
      parts.push({ type: 'equal', text: part.value })
  }

  return parts
})
</script>

<template>
  <article class="prose !text-transparent">
    <span
      v-for="(part, idx) in diffParts"
      :key="idx"
      :class="{
        'underline decoration-wavy decoration-red-500 cursor-pointer': part.type === 'delete',
        '': part.type === 'equal',
      }"
      @click="part.type === 'delete' && emit('openMessageCorrectionModal', part.text)"
    >
      {{ part.text }}
    </span>
  </article>
</template>
