<script setup lang="ts">
import { v } from '@psitta/vue'
import timestampJson from '~/modules/policy/.timestamp.json'

defineProps<{
  id: string
}>()

const timestampData = timestampJson as Record<string, number>
</script>

<template>
  <template v-if="timestampData[id]">
    <time>
      {{ v([new Date((timestampData as any)[id]), {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      }]) }}
    </time>
  </template>
  <template v-else>
    <Icon name="error" class="align-middle text-red-500" />
  </template>
</template>
