<script setup lang="ts">
import type { Translation } from '~/composables/useTranslation'

defineProps<{
  translation: Translation
  right: boolean
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
      class="hidden group-hover:block"
      @click="emit('setReply')"
    >
      <Icon
        name="reply"
        style="font-size: 1rem"
      />
    </Button>
  </div>
</template>
