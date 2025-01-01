<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import { categories } from '~/constants/discover'

const props = defineProps<{
  name: string
  username?: string
  categoryId?: number
  description?: string
  avatar?: string
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
}>()

useLocale()

const category = computed(() => {
  return categories.find(category => category.id === props.categoryId)
})
</script>

<template>
  <div
    role="button"
    class="px-3 hover:bg-slate-100 flex gap-2 rounded items-center group relative"
  >
    <Avatar :name="name" class="w-10 text-sm bg-slate-300 text-slate-800" type="button" />

    <div
      class="flex-1 flex flex-col justify-center"
    >
      <div class="py-1">
        <div class="flex gap-2 items-center text-base text-slate-900 font-bold">
          {{ name }}

          <div
            v-if="username"
            class="text-slate-600 flex gap-1 font-normal"
          >
            @{{ username }}
          </div>
        </div>

        <div v-if="category" class="text-sm text-slate-600 flex gap-1 items-center">
          <Badge class="bg-transparent border-none flex gap-1 px-0 py-3 text-xs text-slate-500">
            <Icon :name="category?.icon" class="" style="font-size: 1.15rem" />

            {{ category?.name }}
          </Badge>
        </div>
      </div>

      <div
        class="flex sm:hidden group-hover:flex right-0 absolute gap-1 py-1 bg-gradient-to-r from-transparent via-white to-white"
      >
        <button
          class="btn btn-ghost btn-circle text-slate-700"
          @click.stop.prevent="emit('edit')"
        >
          <Icon
            name="edit"
            class="text-slate-700"
          />
        </button>

        <button
          class="btn btn-ghost btn-circle text-slate-700"
          @click.stop.prevent="emit('delete')"
        >
          <Icon name="delete" class="text-slate-700" />
        </button>
      </div>
    </div>
  </div>
</template>
