<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { chatMainRef, contentEditableRef, edition } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)

const { updateScrollable } = useChatMainScroll()

const characterQuery = useCharacterQuery(username)
const receiverUsernameNotFound = useReceiverUsernameNotFound()

// prefetch queries before character is loaded
prefetchHistoryQuery(username)
prefetchContactQuery(username)

useEventListener(chatMainRef, 'keydown', (event: KeyboardEvent) => {
  if (edition.editing) {
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
      centered-error-fallback
    >
      <template v-if="receiverUsernameNotFound">
        <CharacterDoesNotExist :username="username" />
      </template>

      <template v-else>
        <ChatMainContent />
      </template>
    </CommonResource>
  </main>
</template>
