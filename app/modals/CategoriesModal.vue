<script setup lang="ts">
import { t } from '@psitta/vue'
import { useForm } from 'vee-validate'
import { useFuse } from '@vueuse/integrations/useFuse'
import type { Category } from '~/constants/discover'
import { categories } from '~/constants/discover'

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

const {
  results: filteredCategories,
} = useFuse(toRef(() => values.search), categories, {
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
    no-padding
  >
    <template #default>
      <div class="h-128 overflow-auto pb-6 my-6 px-4 ">
        <header class="sticky rounded-3xl top-0 px-8 pt-6 pb-4 bg-white z-10">
          <h1 class="mb-4 text-sm text-black">
            {{ t("All categories") }}
          </h1>

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
        </header>

        <CategoryList
          v-if="filteredCategories.length !== 0"
          :categories="filteredCategories.map((category) => category.item)"
          :selected-category-id="selectedCategoryId"
          @click="onItemClick"
        />

        <template v-else>
          <p class="px-12 py-2 text-gray-500 text-sm text-center">
            {{ t(`No results found for "{query}"`, { query: values.search }) }}
          </p>

          <h2 class="px-12 py-2 text-sm text-brown-500">
            {{ t("Browse by categories") }}
          </h2>

          <CategoryList
            :categories="categories"
            :selected-category-id="selectedCategoryId"
            @click="onItemClick"
          />
        </template>
      </div>
    </template>
  </Modal>
</template>
