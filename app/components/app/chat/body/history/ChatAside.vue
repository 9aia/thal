<script setup lang="ts">
defineProps<{
  right: boolean
  isCharacterDeleted: boolean
}>()

const emit = defineEmits<{
  (e: 'setReply'): void
}>()
</script>

<template>
  <div
    class="w-[108px] flex gap-1"
    :class="right ? 'flex-row-reverse' : 'flex-row'"
  >
    <Button
      :disabled="isCharacterDeleted"
      class="hidden group-hover:block btn btn-sm btn-circle btn-neutral"

      icon="material-symbols:reply-rounded"
      icon-class="text-xl"
      @click="emit('setReply')"
    />
  </div>
</template>
