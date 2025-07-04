<script lang="ts" setup>
withDefaults(defineProps<{
  iconName?: string
  iconColor?: string
  hideClose?: boolean
}>(), {
  iconColor: 'text-gray-800',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="bg-white px-2 py-2 flex flex-col items-start justify-between w-min-full">
    <div class="flex items-center gap-2 w-full">
      <div v-if="iconName">
        <div class="p-2 flex items-center justify-center">
          <Icon :name="iconName" :class="iconColor" />
        </div>
      </div>

      <div class="flex flex-col w-full">
        <slot />
      </div>

      <div
        v-if="!hideClose"
        class="flex items-center gap-2"
      >
        <Button
          class="btn btn-md btn-ghost btn-circle"
          icon="material-symbols:close-rounded"
          @click="emit('close')"
        />
      </div>
    </div>
  </div>
</template>
