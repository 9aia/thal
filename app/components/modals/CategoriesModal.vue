<script setup lang="ts">
import { t } from "@psitta/vue"
import { useForm } from "vee-validate"
import { useFuse } from "@vueuse/integrations/useFuse"
import type { Category } from "~/constants/discover"
import { categories } from "~/constants/discover"

const emit = defineEmits<{
  (e: "categoryClick", category: Category): void
}>()

const modelValue = defineModel<boolean>()

const { values, setValues } = useForm({
  initialValues: { search: "" },
})

const {
  results: filteredCategories,
} = useFuse(toRef(values, "search"), categories, {
  fuseOptions: {
    keys: ["name"],
  },
  matchAllWhenSearchEmpty: true,
})

function onItemClick(category: Category) {
  emit("categoryClick", category)
  modelValue.value = false
}

watch(modelValue, (value) => {
  if (value)
    setValues({ search: "" })
})
</script>

<template>
  <Modal
    v-model="modelValue"
    hide-confirm
    show-close-button
    no-padding
    content-class="pb-6"
  >
    <template #default>
      <div class="px-6 pt-6 mb-4">
        <h1 class="font-bold text-2xl mb-2 mt-4">
          {{ t("All categories") }}
        </h1>

        <TextField
          :placeholder="t('Search for categories')"
          path="search"
          icon-position="right"
          class="mb-1"
        >
          <template #icon>
            <Icon
              v-if="!values.search"
              name="search"
            />

            <Icon
              v-else
              name="close"
              role="button"
              :title="t('Clear search')"
              @click="setValues({ search: '' })"
            />
          </template>
        </TextField>
      </div>

      <div class="overflow-auto h-[250px] flex flex-col gap-2">
        <CategoryList
          v-if="filteredCategories.length !== 0"
          :categories="filteredCategories.map((category) => category.item)"
          @click="onItemClick"
        />

        <template v-else>
          <p class="text-slate-500 text-sm py-2 px-6 text-center">
            {{ t(`No results found for "{query}"`, { query: values.search }) }}
          </p>

          <h2 class="font-bold text-sm py-2 text-primary px-6">
            {{ t("Browse by categories") }}
          </h2>

          <CategoryList
            :categories="categories"
            @click="onItemClick"
          />
        </template>
      </div>
    </template>
  </Modal>
</template>
