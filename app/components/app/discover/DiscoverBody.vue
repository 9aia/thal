<script setup lang="ts">
import { t } from '@psitta/vue'
import { refDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { useRouteQuery } from '@vueuse/router'
import { type CategorySlug, categories } from '~/constants/discover'
import { buildCharacter } from '~/store'

const toast = useToast()
const searchRouteQuery = useRouteQuery<string>('search', '')
const categoryRouteQuery = useRouteQuery<CategorySlug>('category', '')

const form = useForm({
  initialValues: {
    search: searchRouteQuery.value,
  },
})

// update url when search changes
watch(() => form.values.search, (newValue) => {
  if (newValue)
    searchRouteQuery.value = newValue
  else
    searchRouteQuery.value = ''
})

onMounted(() => {
  if (Array.isArray(searchRouteQuery.value)) {
    toast.warn('Array search query is not supported. Disabling search.')
  }

  if (Array.isArray(categoryRouteQuery.value)) {
    toast.warn('Array category query is not supported. Disabling category.')
  }
})

const search = refDebounced(toRef(() => form.values.search), 500)

const categoryId = ref(categories.find(c => c.slug === categoryRouteQuery.value)?.id)
</script>

<template>
  <main class="bg-white flex-1 flex items-start focus:outline-hidden overflow-auto">
    <div class="mx-auto pb-4">
      <section class="px-4 pt-4 mb-4">
        <SearchField
          v-model="search"
          :placeholder="t('Search for characters')"
          path="search"
          autofocus
        />
      </section>

      <section>
        <CategoryPanel v-model="categoryId">
          <template #header>
            <h2 class="text-brown-500 text-sm">
              {{ t("Categories") }}
            </h2>
          </template>
        </CategoryPanel>
      </section>

      <section class="space-y-2">
        <h2 class="text-brown-500 px-4 text-sm">
          {{ t("Characters") }}
        </h2>

        <div class="px-4 pb-2 overflow-y-auto mt-4 flex flex-col items-center w-screen sm:w-[500px] lg:w-[600px]">
          <Suspense>
            <template #fallback>
              <div class="py-4 w-full flex justify-center">
                <Spinner class="loading-sm text-orange-500" />
              </div>
            </template>

            <template #default>
              <DiscoverCharacterList
                :search="search"
                :category-id="categoryId"
              />
            </template>
          </Suspense>

          <div class="text-center mt-24 mb-24">
            <h3 class="text-lg mb-2">
              {{ t('Create Your Own Character') }}
            </h3>

            <p class="text-sm text-gray-400 mb-6">
              {{ t('Just describe their personality and behavior in a short prompt — our AI will instantly bring them to life in seconds, ready for dynamic and engaging conversations.') }}
            </p>

            <Button class="btn btn-soft btn-accent rounded-full" @click="buildCharacter(null, search)">
              <Icon name="material-symbols:person-edit-outline-rounded" />
              {{ t("Create character") }}
            </Button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>
