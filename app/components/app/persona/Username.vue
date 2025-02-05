<script setup lang="ts">
const props = defineProps<{
  username: string
  showCopy?: boolean
}>()

const copy = useCopyUsername(props.username)
</script>

<template>
  <button
    v-if="showCopy && username" size="sm" class="text-blue-500 hover:text-blue-600 flex items-center gap-1"
    @click.stop.prevent="copy"
  >
    @{{ username }}
    <Icon name="content_copy" style="font-size: 1.15rem" />
  </button>
</template>
