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
      shape="circle"
      size="sm"
      :disabled="isCharacterDeleted"
      class="hidden group-hover:block"
      @click="emit('setReply')"
    >
      <Icon
        name="material-symbols:reply"
        class="text-base"
      />
    </Button>
  </div>
</template>
