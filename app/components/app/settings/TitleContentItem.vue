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
            <span class="text-primary font-bold text-sm">{{ label }}</span>
          </div>

          <div class="flex gap-2 w-full pt-1">
            <slot name="main" />
          </div>
        </div>

        <Btn v-if="!disableEditButton" class="btn-circle btn-ghost">
          <Icon name="edit" class="cursor-pointer" />
        </Btn>
      </div>

      <div>
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
