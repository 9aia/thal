<script setup lang="ts">
import { diffWords } from 'diff'

const props = defineProps<{ originalText: string, correctedText: string }>()

const diffParts = computed(() => {
  if (!props.originalText || !props.correctedText)
    return [{ type: 'equal' as const, text: props.originalText }]

  const diffs = diffWords(props.originalText, props.correctedText)
  return diffs.map((part) => {
    if ((part as any).added)
      return { type: 'insert' as const, text: (part as any).value as string }
    if ((part as any).removed)
      return { type: 'delete' as const, text: (part as any).value as string }
    return { type: 'equal' as const, text: (part as any).value as string }
  })
})
</script>

<template>
  <span class="leading-relaxed">
    <span
      v-for="(part, idx) in diffParts"
      :key="idx"
      :class="{
        'text-blue-500 bg-blue-500/5 rounded': part.type === 'insert',
        'text-red-500 bg-red-500/5 rounded line-through decoration-red-500 decoration-1': part.type === 'delete',
        '': part.type === 'equal',
      }"
    >
      {{ part.text }}
    </span>
  </span>
</template>
