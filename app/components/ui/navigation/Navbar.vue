<script setup lang="ts">
defineProps<{
  title?: string
  hideBack?: boolean
  hideTitle?: boolean
}>()

const emit = defineEmits<({
  (e: 'close'): void
})>()
</script>

<template>
  <div class="bg-white border-b border-gray-100 px-3 py-2 h-[64px] flex gap-2 justify-between">
    <h1 v-if="!hideTitle" class="text-lg py-2 text-gradient-1 flex items-center gap-1 -translate-x-2">
      <Button v-if="!hideBack" class="btn-ghost text-black" size="md" shape="circle" @click="emit('close')">
        <Icon name="material-symbols:arrow-back" />
      </Button>

      {{ title }}
    </h1>

    <slot />
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: radial-gradient(theme('colors.blue.500'), theme('colors.cyan.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
