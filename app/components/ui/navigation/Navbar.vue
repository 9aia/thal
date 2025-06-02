<script setup lang="ts">
defineProps<{
  title?: string
  hideBack?: 'always' | 'on-lg' | 'never'
  hideTitle?: boolean
}>()

const emit = defineEmits<({
  (e: 'close'): void
})>()
</script>

<template>
  <div class="bg-white px-3 pt-2 pb-0 h-[64px] flex gap-2 justify-between">
    <h1 v-if="!hideTitle" class="text-sm py-2 text-black flex items-center gap-1 -translate-x-2">
      <Button
        v-if="hideBack !== 'never'"
        class="btn btn-md btn-ghost btn-circle text-black"
        :class="{
          'lg:hidden': hideBack === 'on-lg',
        }"
        @click="emit('close')"
      >
        <Icon name="material-symbols:arrow-back" />
      </Button>

      {{ title }}
    </h1>

    <slot />
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: radial-gradient(var(--color-blue-500), var(--color-blue-500)) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
