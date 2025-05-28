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
  <div
    v-for="category, index in categories"
    :key="`category-${index}`"
    class="flex py-2 gap-x-4 px-6 group"
    role="button"
    @click="emit('click', category)"
  >
    <Icon
      :name="category.icon"
      :class="checkIsSelected(category.id) ? 'text-blue-500' : 'text-gray-800'"
    />

    <div :class="checkIsSelected(category.id) ? 'text-blue-500' : 'text-gray-800 group-hover:underline'">
      {{ t(category.name) }}
    </div>
  </div>
</template>
