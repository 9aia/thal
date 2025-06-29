<script setup lang="ts">
import { t } from '@psitta/vue'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  search: string
  categoryId?: number
}>()

const localeWithDefaultRegion = useLocaleWithDefaultRegion()

const headers = useRequestHeaders(['cookie'])
const discoverQuery = usePaginationQuery({
  queryKey: queryKeys.discoverCharactersSearch(localeWithDefaultRegion, toRef(() => props.search), toRef(() => props.categoryId)),
  queryFn: ({ query }) => $fetch('/api/character/discover', {
    params: {
      ...query,
      search: props.search,
      categoryId: props.categoryId,
      locale: localeWithDefaultRegion.value,
    },
    headers,
  }),
  perPage: 10,
})

onServerPrefetch(discoverQuery.suspense)

const emptyMessage = computed(() => {
  if (props.search) {
    return t(`No results found for "{query}"`, { query: props.search })
  }

  if (props.categoryId) {
    const categoryName = getCategoryById(props.categoryId)?.name
    return t('No results found for category "{categoryName}"', { categoryName })
  }

  return t('No results found.')
})
</script>

<template>
  <CommonResource
    :for="discoverQuery"
    :empty-condition="!discoverQuery.data.value?.pages?.length"
    :empty-message="emptyMessage"
  >
    <DiscoverCharacterItem
      v-for="character in discoverQuery.data.value?.pages"
      :key="`character-${character.id}`"
      :name="character.name"
      :description="character.description"
      :category-id="character.categoryId"
      :username="character.username"
      show-copy
      show-send-message
      class="w-full"
    />

    <Observable
      class="w-full min-h-px flex items-center justify-center"
      :is-connected="discoverQuery.hasNextPage.value"
      @intersect="discoverQuery.fetchNextPage()"
    >
      <template #default="{ visible }">
        <Spinner
          v-if="visible && discoverQuery.hasNextPage.value && discoverQuery.isLoading.value"
          class="mt-6 text-gray-800"
        />
      </template>
    </Observable>
  </CommonResource>
</template>
