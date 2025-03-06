<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { categories } from '~/constants/discover'
import queryKeys from '~/queryKeys'
import { buildPersona } from '~/store'

const { t } = useI18nExperimental()
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
  queryKey: queryKeys.discoverPersonasSearch(search, categoryId),
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

const { focusMainField: focusSearch, mainField: searchEl } = useDiscoverFocus()

onMounted(() => {
  focusSearch({ immediate: true })
})
</script>

<template>
  <main
    :tabindex="0"
    class="bg-white flex-1 flex items-start overflow-y-auto focus:outline-none overflow-x-hidden"
  >
    <CategoriesModal
      v-model="isCategoryModalOpen"
      :selected-category-id="categoryId"
      @category-click="toggleCategory"
    />

    <div class="mx-auto pb-4">
      <div class="px-4 pt-4 mb-4">
        <TextField
          ref="searchEl"
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
          <h2 class="text-brown-500 text-sm">
            {{ t("Categories") }}
          </h2>
          <button
            class="text-blue-500 text-xs float-right"
            @click="isCategoryModalOpen = true"
          >
            {{ t("View all") }}
          </button>
        </div>

        <DraggableArea
          v-slot="{ bindData }"
          class="flex gap-2 px-4 overflow-x-hidden w-screen sm:w-[500px] lg:w-[600px] cursor-grab pb-3"
        >
          <CategoryCard
            v-for="category, index in categories"
            v-bind="bindData"
            :key="`category-${index}`"
            :name="t(category.name)"
            :description="t(category.description)"
            :icon="category.icon"
            :color="category.color"
            :is-selected="categoryId === category.id"
            @click="toggleCategory(category.id)"
          />
        </DraggableArea>
      </div>

      <div class="space-y-2">
        <h2 class="text-brown-500 px-4 text-sm">
          {{ t("Characters") }}
        </h2>

        <div class="px-4 pb-2 overflow-y-auto mt-4 flex flex-col items-center w-screen sm:w-[500px] lg:w-[600px]">
          <StyledResource
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

            <div v-else class="flex flex-col items-center gap-y-4">
              <p class="text-gray-500 text-sm py-2 px-6 text-center">
                {{ search ? t(`No results found for "{query}"`, { query: search }) : t('No results found.') }}
              </p>
            </div>

            <div class="text-center mt-24 mb-24">
              <h3 class="text-lg mb-2">
                {{ t('Create Your Own Character') }}
              </h3>

              <p class="text-sm text-gray-400 mb-6">
                {{ t('Easily build a character that fits your learning style! Choose a name and personality, and let the AI bring them to life through dynamic conversations.') }}
              </p>

              <Button class="border-gradient-2 rounded-full" @click="buildPersona({ username: search && generateCharacterUsername(search), name: search && generateCharacterName(search) })">
                <span class="px-4 py-1 flex items-center justify-center gap-1">
                  <Icon name="person_edit" />
                  {{ t("Create character") }}
                </span>
              </Button>
            </div>
          </StyledResource>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.border-gradient-2 {
  @apply border-none px-1 py-1 bg-blue-50 text-blue-500;
  @apply bg-gray-50;
}
</style>
