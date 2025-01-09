<script setup lang="ts">
const props = defineProps<{
  username: string
  showCopy?: boolean
}>()

const copy = useCopyUsername(props.username)
</script>

<template>
  <div class="text-gray-600 flex gap-1 font-normal">
    @{{ username }}

    <button
      v-if="showCopy && username"
      size="sm"
      class="text-teal-500 hover:text-teal-600 flex items-center"
      @click.stop.prevent="copy"
    >
      <Icon name="content_copy" style="font-size: 1.15rem" />
    </button>
  </div>
</template>
