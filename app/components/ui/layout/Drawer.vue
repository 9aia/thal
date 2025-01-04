<script setup lang="ts">
const modelValue = defineModel<boolean>({
  required: true,
})
</script>

<template>
  <div
    class="drawer"
    :class="{ 'pointer-events-none': !modelValue }"
  >
    <input
      v-model="modelValue"
      type="checkbox"
      class="drawer-toggle"
    >

    <div class="drawer-content flex flex-col h-dvh">
      <slot name="content" />
    </div>

    <div class="drawer-side">
      <div class="flex flex-col h-dvh justify-between w-full">
        <slot v-if="modelValue" :close="() => modelValue = false" />
      </div>

      <slot name="footer" />
    </div>
  </div>
</template>
