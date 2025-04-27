<script setup lang="ts">
const props = withDefaults(defineProps<{
  username: string
  showCopy?: 'right' | 'left' | boolean
}>(), {
  showCopy: 'right',
})

const copy = useCopyUsername(props.username)
</script>

<template>
  <component
    :is="showCopy ? 'button' : 'span'"
    size="sm"
    class="text-blue-500 hover:text-blue-600 flex items-center gap-1"
    @click.stop.prevent="!!showCopy && copy()"
  >
    <Icon v-if="showCopy === 'left'" name="material-symbols:content-copy-outline" class="text-xl" />
    @{{ username }}
    <Icon v-if="showCopy === 'right' || showCopy === true" name="material-symbols:content-copy-outline" class="text-xl" />
  </component>
</template>
