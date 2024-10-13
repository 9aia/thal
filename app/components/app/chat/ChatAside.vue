<script setup lang="ts">
import type { Translation } from "~/composables/useTranslation"

const props = defineProps<{
  translation: Translation
}>()

const hideTranslateBtn = computed(() => {
  return props.translation.isOpen.value === true
    && !props.translation.isError.value
    && !props.translation.isLoading.value
})
</script>

<template>
  <div class="w-[108px] flex gap-1">
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
  </div>
</template>
