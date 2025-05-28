<script setup lang="ts">
import { t } from '@psitta/vue'
import { useRouteQuery } from '@vueuse/router'
import { type CategorySlug, categories } from '~/constants/discover'

const categoryId = defineModel<number>()
const categorySlug = computed(() => categories.find(c => c.id === categoryId.value)!.slug)

const categoryRouteQuery = useRouteQuery<CategorySlug>('category', '')

watch(categoryId, (newValue) => {
  // update url when category changes
  if (newValue !== undefined)
    categoryRouteQuery.value = categorySlug.value
  else
    categoryRouteQuery.value = ''

  // scroll to category when it changes
  const el = document.querySelector(`#category-${categoryId.value}`)

  if (el) {
    el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    })
  }
})

function toggleCategory(id: number) {
  categoryId.value = categoryId.value !== id ? id : undefined
}

const isCategoryModalOpen = ref(false)
</script>

<template>
  <div class="flex justify-between px-4">
    <slot name="header" />

    <button
      class="text-blue-500 text-xs float-right"
      @click="isCategoryModalOpen = true"
    >
      {{ t("View all") }}
    </button>
  </div>

  <DraggableArea
    v-slot="{ bindData }"
    class="flex gap-2 py-4 px-4 overflow-x-hidden w-screen sm:w-[500px] lg:w-[600px] cursor-grab pb-3"
  >
    <CategoryCard
      v-for="category, index in categories"
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
