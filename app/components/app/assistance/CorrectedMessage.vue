<script setup lang="ts">
import { diffWords } from 'diff'

const props = defineProps<{ originalText: string, correctedText: string }>()

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
  <article class="prose">
    <span
      v-for="(part, idx) in diffParts"
      :key="idx"
      :class="{
        'underline decoration-wavy decoration-red-500': part.type === 'delete',
        '': part.type === 'equal',
      }"
    >
      {{ part.text }}
    </span>
  </article>
</template>
