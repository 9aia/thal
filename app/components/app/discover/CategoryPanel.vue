<script setup lang="ts">
import { t } from '@psitta/vue'
import { useRouteQuery } from '@vueuse/router'
import { tv } from 'tailwind-variants'
import { type CategorySlug, categories } from '~/constants/discover'

defineProps<{
  headerClass?: string
  bodyClass?: string
  viewAllButtonClass?: string
}>()

const categoriesData = computed(() => {
  return categories.map(category => ({
    ...category,
    name: t(category.name),
  })).sort((a, b) => a.name.localeCompare(b.name))
})

const categoryId = defineModel<number>()
const categorySlug = computed(() => categoriesData.value.find(c => c.id === categoryId.value)!.slug)
const categoryRouteQuery = useRouteQuery<CategorySlug>('category', '')

watch(categoryId, (newValue) => {
  // update url when category changes
  if (newValue !== undefined)
    categoryRouteQuery.value = categorySlug.value
  else
    categoryRouteQuery.value = ''
})

function toggleCategory(id: number) {
  categoryId.value = categoryId.value !== id ? id : undefined
}

const isCategoryModalOpen = ref(false)

const headerStyles = tv({
  base: 'flex justify-between relative',
})

const bodyStyles = tv({
  base: 'py-4 flex gap-2 overflow-x-hidden cursor-grab pb-3',
})

const viewAllButtonStyles = tv({
  base: 'text-blue-500 text-xs float-right cursor-pointer border-b-2 border-transparent focus:border-b-2 focus:border-b-blue-500 focus:outline-hidden',
})
</script>

<template>
  <div :class="headerStyles({ class: headerClass })">
    <slot name="header" />

    <button
      :class="viewAllButtonStyles({ class: viewAllButtonClass })"
      @click="isCategoryModalOpen = true"
    >
      {{ t("View all") }}
    </button>
  </div>

  <DraggableArea
    v-slot="{ bindData }"
    :class="bodyStyles({ class: bodyClass })"
  >
    <CategoryCard
      v-for="category, index in categoriesData"
      v-bind="bindData"
      :id="`category-${category.id}`"
      :key="`category-${index}`"
      :name="t(category.name)"
      :description="t(category.description)"
      :icon="category.icon"
      :color="category.color"
      :is-selected="categoryId === category.id"
      @click="toggleCategory(category.id)"
    />
  </DraggableArea>

  <CategoriesModal
    v-model="isCategoryModalOpen"
    :selected-category-id="categoryId"
    @category-click="toggleCategory"
  />
</template>
