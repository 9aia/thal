<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { chatMainRef, contentEditableRef, edition } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)

const { updateScrollable, scrollBottom } = useChatMainScroll()

const characterQuery = useCharacterQuery(username)
const usernameNotFound = computed(() => !characterQuery.data.value?.usernameId)

// prefetch queries before character is loaded
prefetchHistoryQuery(username)
prefetchContactQuery(username)

useEventListener(chatMainRef, 'keydown', (event: KeyboardEvent) => {
  if (edition.messageId !== undefined) {
    return
  }

  // ignore modifier keys
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || event.code === 'Tab')
    return

  // explicitly check for 'Meta' key (some browsers may not set event.metaKey reliably)
  if (event.key === 'Meta')
    return

  // ignore function keys (F1-F12) and Escape
  if (event.key.startsWith('F') || event.key === 'Escape')
    return

  contentEditableRef.value?.focus()
})

useEventListener(chatMainRef, 'scroll', () => {
  updateScrollable()
})

onMounted(() => {
  contentEditableRef.value?.focus()

  scrollBottom()
})
</script>

<template>
  <main
    ref="chatMainRef"
    :tabindex="0"
    class="bg-white overflow-y-auto w-full py-4 px-4 flex-1 flex items-center justify-center relative focus:outline-hidden"
  >
    <CommonResource
      :for="characterQuery"
      common-error-fallback-class="px-6 mt-8"
      centered-error-fallback
    >
      <template #default>
        <template v-if="usernameNotFound">
          <CharacterDoesNotExist :username="username" />
        </template>

        <template v-else>
          <ChatMainContent />
        </template>
      </template>
    </CommonResource>
  </main>
</template>
