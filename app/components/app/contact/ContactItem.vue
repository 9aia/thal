<script setup lang="ts">
defineProps<{
  name: string
  description: string
  avatar?: string
  showEdit?: boolean
  showDelete?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()
</script>

<template>
  <div role="button" class="flex gap-4 rounded-xs items-center group cursor-pointer">
    <Avatar
      :name="name"
      type="button"
      wrapper-class="bg-neutral text-neutral-content"
    />

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex flex-col justify-between">
        <a class="block text-base text-gray-800">{{ name }}</a>

        <div
          class="text-xs text-gray-600 line-clamp-2"
          :title="description"
        >
          {{ description }}
        </div>
      </div>
    </div>

    <div
      class="hidden"
      :class="{
        'group-hover:flex': showEdit || showDelete,
      }"
    >
      <Button
        v-if="showEdit"
        class="btn btn-circle btn-sm btn-ghost"
        icon="material-symbols:edit-outline"
        icon-class="text-xl"

        @click.prevent="emit('edit')"
      />

      <Button
        v-if="showDelete"
        class="btn btn-circle btn-sm btn-ghost"
        icon="material-symbols:delete-outline-rounded"
        icon-class="text-xl"

        @click.prevent="emit('delete')"
      />
    </div>
  </div>
</template>

<style scoped>
.hover\:bg-gradient-1:hover {
  background: radial-gradient(circle, var(--color-magenta-50), var(--color-white));
}
</style>
