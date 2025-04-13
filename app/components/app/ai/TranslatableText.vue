<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

const props = defineProps<{
  text: string
}>()

const translation = useAsyncState(async () => {
  return await $fetch('/api/translate', {
    method: 'POST',
    body: {
      messageText: props.text,
      locale: 'pt-br',
    },
  })
}, undefined, { immediate: false })

const open = ref(false)

async function openTooltip() {
  open.value = true

  if (!translation.state.value?.translation)
    await translation.execute()
}
</script>

<template>
  <Tooltip v-model="open">
    <template #anchor>
      <button class="flex flex-wrap gap-[0.4ch]" @click="openTooltip" @mouseover="openTooltip">
        {{ text }}
      </button>
    </template>

    <template #content>
      <div v-if="translation.isLoading.value" class="flex">
        <Spinner class="text-gray-800" />
      </div>

      <div v-else class="flex flex-wrap gap-[0.4ch]">
        {{ translation.state.value?.translation }}
      </div>
    </template>
  </Tooltip>
</template>
