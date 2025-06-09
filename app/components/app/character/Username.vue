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
    class="text-blue-500 hover:text-blue-600 flex items-center gap-1 border-b-2 border-transparent focus:border-blue-500 focus:outline-none"
    :class="{ 'flex-row-reverse': showCopy === 'left', 'cursor-pointer': showCopy }"
    @click.stop.prevent="!!showCopy && copy()"
  >
    @{{ username }}
    <Icon v-if="Boolean(showCopy)" name="material-symbols:content-copy-outline-rounded" class="text-xl" />
  </component>
</template>
