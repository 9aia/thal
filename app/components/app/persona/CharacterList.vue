<script setup lang="ts">
import { useI18n } from '@psitta/vue'
import { refDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { categories } from '~/constants/discover'
import queryKeys from '~/queryKeys'

const { t } = useI18n()
const form = useForm({
  initialValues: { search: '' },
})

const search = refDebounced(toRef(form.values, 'search'), 1000)
const categoryId = ref<number>()

function toggleCategory(id: number) {
  categoryId.value = categoryId.value !== id ? id : undefined
}

const {
  data,
  isError,
  isPending,
  fetchNextPage,
  refetch,
  hasNextPage,
} = usePaginationQuery({
  queryKey: queryKeys.discoverPersonas(search, categoryId),
  queryFn: ({ params }) => $fetch('/api/persona/discover', {
    params: {
      ...params,
      search: search.value,
      categoryId: categoryId.value,
    },
  }),
  perPage: 3,
})

const isCategoryModalOpen = ref(false)
</script>

<template>
  <main
    :tabindex="0"
    class="bg-slate-200 flex-1 flex items-start overflow-y-auto focus:outline-none overflow-x-hidden"
  >
    <CategoriesModal
      v-model="isCategoryModalOpen"
      :selected-category-id="categoryId"
      @category-click="toggleCategory"
    />

    <div class="mx-auto pb-4">
      <div class="px-4 pt-4 mb-4">
        <TextField
          :placeholder="t('Search for characters')"
          path="search"
          icon-position="right"
        >
          <template #icon>
            <Icon
              v-if="!form.values.search"
              name="search"
            />

            <Icon
              v-else
              name="close"
              role="button"
              @click="form.setValues({ search: '' })"
            />
          </template>
        </TextField>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between px-4">
          <h2 class="text-slate-800 text-sm font-bold">
            {{ t("Categories") }}
          </h2>
          <button
            class="text-teal-500 text-xs font-bold float-right"
            @click="isCategoryModalOpen = true"
          >
            {{ t("View all") }}
          </button>
        </div>

        <div v-drag-scroller class="flex gap-2 px-4 overflow-x-hidden w-screen sm:w-[500px] lg:w-[600px] cursor-grab pb-3">
          <CategoryCard
            v-for="category, index in categories"
            :key="`category-${index}`"
            :name="t(category.name)"
            :description="t(category.description)"
            :icon="category.icon"
            :color="category.color"
            :is-selected="categoryId === category.id"
            @click="toggleCategory(category.id)"
          />
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-slate-800 font-bold px-4 text-sm">
          {{ t("Characters") }}
        </h2>

        <div class="pl-2 pr-4 pb-2 space-y-1 overflow-y-auto mt-4 flex flex-col items-center">
          <Resource
            :error="isError"
            :loading="isPending"
            @execute="refetch"
          >
            <template v-if="data?.pages?.length">
              <DiscoverCharacterItem
                v-for="character in data?.pages"
                :key="`persona-${character.id}`"
                :name="character.name"
                :description="character.description"
                :category-id="character.categoryId"
                :username="character.personaUsernames?.username"
                show-copy
                show-send-message
                class="w-full"
              />

              <Observable class="w-full h-px" :is-connected="hasNextPage" @intersect="fetchNextPage()" />
            </template>

            <template v-else>
              <p class="text-slate-500 text-sm py-2 px-6 text-center">
                {{ search ? t(`No results found for "{query}"`, { query: search }) : t('No results found.') }}
              </p>
            </template>
          </resource>
        </div>
      </div>
    </div>
  </main>
</template>
