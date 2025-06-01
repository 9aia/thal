<script setup lang="ts">
const scrollContainer = ref<HTMLDivElement>()

const route = useRoute()
const username = computed(() => route.params.username as string)
const characterQuery = useCharacterQuery(username)
const characterNotFound = useState('characterNotFound', () => false)
</script>

<template>
  <main
    id="chat-container"
    ref="scrollContainer"
    :tabindex="0"
    class="bg-white w-full py-4 px-4 flex-1 overflow-y-auto relative focus:outline-hidden"
  >
    <StyledResource
      :loading="characterQuery.isLoading.value"
      :error="characterQuery.isError.value"
      @execute="characterQuery.refetch()"
    >
      <template v-if="characterNotFound">
        <CharacterNotFound :username="username" />
      </template>

      <template v-else>
        Body // TODO
      </template>
    </StyledResource>
  </main>
</template>
