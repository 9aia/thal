<script setup lang="ts">
import type { Translation } from '~/composables/useTranslation'

const props = defineProps<{
  translation: Translation
  right: boolean
}>()

const emit = defineEmits<{
  (e: 'setReply'): void
}>()

const hideTranslateBtn = computed(() => {
  return props.translation.isOpen.value === true
    && !props.translation.isError.value
    && !props.translation.isLoading.value
})
</script>

<template>
  <div
    class="w-[108px] flex gap-1"
    :class="right ? 'flex-row-reverse' : 'flex-row'"
  >
    <Btn
      v-if="!hideTranslateBtn"
      shape="circle"
      size="sm"
      :class="translation.isLoading.value ? 'block' : 'hidden group-hover:block'"
      :loading="translation.isLoading.value"
      @click="translation.onTranslate"
    >
      <Icon
        v-if="!translation.isLoading.value"
        name="translate"
        style="font-size: 1rem"
      />
    </Btn>

    <Btn
      shape="circle"
      size="sm"
      class="hidden group-hover:block"
      @click="emit('setReply')"
    >
      <Icon
        name="reply"
        style="font-size: 1rem"
      />
    </Btn>
  </div>
</template>
