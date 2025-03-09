<script lang="ts" setup>
withDefaults(defineProps<{
  iconName?: string
  iconColor?: string
  hideClose?: boolean
}>(), {
  iconColor: 'text-gray-800',
})

const modelValue = defineModel<boolean>()
</script>

<template>
  <div v-if="modelValue" class="bg-white px-3 py-2 flex flex-col items-start justify-between w-min-full">
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
        <button class="btn btn-md btn-ghost btn-circle" @click="modelValue = false">
          <Icon name="close" class="text-gray-800" />
        </button>
      </div>
    </div>
  </div>
</template>
