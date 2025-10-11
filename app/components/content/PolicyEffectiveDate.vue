<script setup lang="ts">
import { v } from '@psitta/vue'
import timestampJson from '~~/content/.timestamp.json'

const route = useRoute()
const document = computed(() => route.params.document)

const id = computed(() => `/legal/pt-BR/${document.value}.md`)

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
    <Icon name="material-symbols:error-outline-rounded" class="align-middle text-red-500" />
  </template>
</template>
