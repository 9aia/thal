<script setup lang="ts">
defineProps<{
  title?: string
  hideBack?: 'always' | 'on-lg' | 'never'
  hideTitle?: boolean
  backIcon?: string
}>()

const emit = defineEmits<({
  (e: 'back'): void
})>()
</script>

<template>
  <div
    class="bg-white px-6 pt-4 pb-0 h-[64px] min-h-[64px] flex gap-2 justify-between"
  >
    <h1 v-if="!hideTitle" class="text-sm py-2 text-black flex items-center justify-start gap-1 -translate-x-1.5">
      <Button
        v-if="hideBack !== 'never'"
        class="btn btn-neutral btn-md btn-ghost btn-circle"
        :class="{
          'lg:hidden': hideBack === 'on-lg',
        }"
        :icon="backIcon || 'material-symbols:arrow-back-rounded'"
        @click="emit('back')"
      />

      <slot name="title">
        {{ title }}
      </slot>
    </h1>

    <slot />
  </div>
</template>
