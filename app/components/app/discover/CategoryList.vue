<script setup lang="ts">
import { t } from '@psitta/vue'
import type { Category } from '~/constants/discover'

const props = defineProps<{
  categories: Category[]
  selectedCategoryId?: number
}>()

const emit = defineEmits<{
  (e: 'click', category: Category): void
}>()

function checkIsSelected(categoryId: number) {
  return props.selectedCategoryId === categoryId
}
</script>

<template>
  <div class="flex flex-col gap-2 px-12 py-1">
    <button
      v-for="category, index in categories"
      :key="`category-${index}`"
      class="group cursor-pointer group focus:outline-hidden"
      @click="emit('click', category)"
    >
      <div class="px-5 py-2 flex w-full gap-4 rounded-full bg-white group-focus:ring-2 group-focus:ring-blue-500 group-focus:ring-offset-2">
        <Icon
          :name="category.icon"
          :class="checkIsSelected(category.id) ? 'text-gray-400' : 'text-gray-800'"
        />

        <div :class="checkIsSelected(category.id) ? 'text-gray-400' : 'text-gray-800'">
          {{ t(category.name) }}
        </div>
      </div>
    </button>
  </div>
</template>
