<script setup lang="ts">
const emit = defineEmits<{
  (e: 'edit'): void
}>()

const user = useUser()
</script>

<template>
  <div
    role="button"
    class="flex justify-between items-start"
    @click="emit('edit')"
  >
    <div class="flex flex-col gap-4 w-full">
      <div class="pt-4 flex justify-center">
        <Avatar :name="user?.name" class="w-32 text-3xl mx-auto bg-gray-300 text-gray-800" />
      </div>
    </div>
  </div>
</template>
