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
  <div
    class="bg-white px-4 pt-4 pb-0 h-[64px] min-h-[64px] flex gap-2 justify-between"
  >
    <h1 v-if="!hideTitle" class="text-sm py-2 text-black flex items-center justify-start gap-1 -translate-x-1.5">
      <Button
        v-if="hideBack !== 'never'"
        class="btn btn-neutral btn-md btn-ghost btn-circle"
        :class="{
          'lg:hidden': hideBack === 'on-lg',
        }"
        @click="emit('close')"
      >
        <Icon name="material-symbols:arrow-back-rounded" />
      </Button>

      {{ title }}
    </h1>

    <slot />
  </div>
</template>
