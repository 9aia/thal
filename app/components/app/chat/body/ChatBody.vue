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
    class="bg-white w-full py-4 px-4 flex-1 flex items-center justify-center overflow-y-auto relative focus:outline-hidden"
  >
    <CommonResource
      :for="characterQuery"
      centered-error-fallback
    >
      <template v-if="characterNotFound">
        <CharacterNotFound :username="username" />
      </template>

      <template v-else>
        Body // TODO
      </template>
    </CommonResource>
  </main>
</template>
