<script setup lang="ts">
import { chatContainerRef } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)
const characterQuery = useCharacterQuery(username)
const characterNotFound = useState('characterNotFound', () => false)
</script>

<template>
  <main
    id="chat-container"
    ref="chatContainerRef"
    :tabindex="0"
    class="bg-white overflow-y-auto w-full py-4 px-4 flex-1 flex items-center justify-center relative focus:outline-hidden"
  >
    <CommonResource
      :for="characterQuery"
      centered-error-fallback
    >
      <template v-if="characterNotFound">
        <CharacterNotFound :username="username" />
      </template>

      <template v-else>
        <ChatMainContent />
      </template>
    </CommonResource>
  </main>
</template>
