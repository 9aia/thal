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
  <div class="flex flex-col gap-4 px-12 py-1">
    <div
      v-for="category, index in categories"
      :key="`category-${index}`"
      class="cursor-pointer flex items-center gap-4"
      @click="emit('click', category)"
    >
      <Button class="btn btn-lg btn-neutral btn-circle">
        <Icon
          :name="category.icon"
          :class="category.color"
        />
      </Button>

      <div class="flex flex-col gap-1 relative w-full">
        <p class="flex items-center gap-2" :class="checkIsSelected(category.id) ? 'text-accent' : 'text-black'">
          {{ t(category.name) }}
        </p>

        <p class="text-xs text-gray-500">
          {{ t(category.description) }}
        </p>
      </div>
    </div>
  </div>
</template>
