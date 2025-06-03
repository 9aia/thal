<script setup lang="ts">
const emit = defineEmits<{
  (e: 'edit'): void
}>()

const user = useUser()
</script>

<template>
  <div
    role="button"
    class="flex justify-between items-start cursor-pointer"
    @click="emit('edit')"
  >
    <div class="flex flex-col gap-4 w-full">
      <div class="pt-4 flex justify-center">
        <Avatar
          :name="user?.name"
          size="xl"
          wrapper-class="bg-neutral text-neutral-content"
          class="mx-auto"
        />
      </div>
    </div>
  </div>
</template>
