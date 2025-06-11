<script lang="ts" setup>
defineProps<{
  label: string
  disableEditButton?: boolean
}>()
</script>

<template>
  <div class="flex items-start space-x-4 w-full">
    <div class="flex flex-col space-y-0 w-full">
      <div class="flex justify-between w-full">
        <div class="flex flex-col space-y-0 w-full">
          <div class="flex items-center space-x-2">
            <slot name="icon" />
            <span class="text-gray-800 text-sm">{{ label }}</span>
          </div>

          <div class="flex gap-2 w-full pt-1">
            <slot name="main" />
          </div>
        </div>

        <Button
          v-if="!disableEditButton"
          class="btn btn-circle btn-ghost"
          icon="material-symbols:edit-outline-rounded"
          
        />
      </div>

      <div>
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
