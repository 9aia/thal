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
  <div role="button" class="px-3 py-1 hover:bg-slate-100 flex gap-2 rounded items-center group">
    <Avatar :name="name" class="w-10 text-sm bg-slate-300 text-slate-800" type="button" />

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex flex-col justify-between">
        <a class="block text-base text-slate-800">{{ name }}</a>

        <div
          class="text-xs text-slate-600 line-clamp-2"
          :title="description"
        >
          {{ description }}
        </div>
      </div>
    </div>

    <div class="hidden group-hover:flex">
      <button
        v-if="showEdit"
        class="btn btn-md btn-ghost btn-circle"
        @click.prevent="emit('edit')"
      >
        <Icon name="edit" class="text-slate-700" />
      </button>

      <button
        v-if="showDelete"
        class="btn btn-ghost btn-circle"
        @click.prevent="emit('delete')"
      >
        <Icon name="delete" class="text-slate-700 text-xs" />
      </button>
    </div>
  </div>
</template>
