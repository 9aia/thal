<script setup lang="ts">
import { t } from '@psitta/vue'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  search: string
  categoryId?: number
}>()

const localeWithDefaultRegion = useLocaleDefaultRegion()
const headers = useRequestHeaders(['cookie'])

const {
  data,
  isError,
  isLoading,
  fetchNextPage,
  refetch,
  hasNextPage,
  suspense,
} = usePaginationQuery({
  queryKey: queryKeys.discoverCharactersSearch(localeWithDefaultRegion, toRef(() => props.search), toRef(() => props.categoryId)),
  queryFn: ({ params }) => $fetch('/api/character/discover', {
    params: {
      ...params,
      search: props.search,
      categoryId: props.categoryId,
      locale: localeWithDefaultRegion.value,
    },
    headers,
  }),
  perPage: 10,
})

onServerPrefetch(suspense)
</script>

<template>
  <StyledResource
    :error="isError"
    :loading="isLoading"
    @execute="refetch"
  >
    <template v-if="data?.pages?.length">
      <DiscoverCharacterItem
        v-for="character in data?.pages"
        :key="`character-${character.id}`"
        :name="character.name"
        :description="character.description"
        :category-id="character.categoryId"
        :username="character.username"
        show-copy
        show-send-message
        class="w-full"
      />

      <Observable class="w-full min-h-px flex items-center justify-center" :is-connected="hasNextPage" @intersect="fetchNextPage()">
        <template #default="{ visible }">
          <Spinner v-if="visible && hasNextPage && isLoading" class="mt-6 text-gray-800" />
        </template>
      </Observable>
    </template>

    <div v-else class="flex flex-col items-center gap-y-4">
      <p class="text-gray-500 text-sm py-2 px-6 text-center">
        {{ search ? t(`No results found for "{query}"`, { query: search }) : t('No results found.') }}
      </p>
    </div>
  </StyledResource>
</template>
