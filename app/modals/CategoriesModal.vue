<script setup lang="ts">
import { t } from '@psitta/vue'
import { useForm } from 'vee-validate'
import { useFuse } from '@vueuse/integrations/useFuse'
import type { Category } from '#shared/constants/discover'
import { categories } from '#shared/constants/discover'

defineProps<{
  selectedCategoryId?: number
}>()

const emit = defineEmits<{
  (e: 'categoryClick', categoryId: number): void
}>()

const modelValue = defineModel<boolean>()

const { values, setValues } = useForm({
  initialValues: { search: '' },
})

const categoriesToFilter = computed(() => {
  return categories.map(category => ({
    ...category,
    name: t(category.name),
  })).sort((a, b) => a.name.localeCompare(b.name))
})

const {
  results: filteredCategories,
} = useFuse(toRef(() => values.search), categoriesToFilter, {
  fuseOptions: {
    keys: ['name'],
  },
  matchAllWhenSearchEmpty: true,
})

function onItemClick(category: Category) {
  emit('categoryClick', category.id)
  modelValue.value = false
}

watch(modelValue, (value) => {
  if (value)
    setValues({ search: '' })
})
</script>

<template>
  <Modal
    v-model="modelValue"
    hide-confirm
    show-close-button
    :title="t('All categories')"
  >
    <template #header>
      <form>
        <SearchField
          v-model="values.search"
          :placeholder="t('Search for categories')"
          path="search"
          autofocus
          class="pointer-events-auto"
          input-class="input-lg input-primary w-full"
        />
      </form>
    </template>

    <template #default>
      <CategoryList
        v-if="filteredCategories.length !== 0"
        class="px-8 py-1"
        :categories="filteredCategories.map((category) => category.item)"
        :selected-category-id="selectedCategoryId"
        @click="onItemClick"
      />

      <template v-else>
        <p class="px-8 py-2 mb-2 text-gray-500 text-sm text-center">
          {{ t(`No results found for "{query}"`, { query: values.search }) }}
        </p>

        <h2 class="px-8 py-4 text-sm text-brown-500">
          {{ t("Browse by categories") }}
        </h2>

        <CategoryList
          class="px-8 py-1"
          :categories="categories"
          :selected-category-id="selectedCategoryId"
          @click="onItemClick"
        />
      </template>
    </template>
  </Modal>
</template>
