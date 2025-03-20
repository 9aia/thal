<script setup lang="ts">
const props = defineProps<{
  username: string
  showCopy?: boolean
}>()

const copy = useCopyUsername(props.username)
</script>

<template>
  <component
    :is="showCopy ? 'button' : 'span'"
    size="sm"
    class="text-blue-500 hover:text-blue-600 flex items-center gap-1"
    @click.stop.prevent="showCopy && copy"
  >
    @{{ username }}
    <Icon v-if="showCopy" name="content_copy" style="font-size: 1.15rem" />
  </component>
</template>
