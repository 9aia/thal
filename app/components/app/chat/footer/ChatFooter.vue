<script lang="ts" setup>
import { inReplyTos } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)
const hasInReplyTo = computed(() => !!inReplyTos[username.value])
</script>

<template>
  <footer class="bg-white flex items-end justify-center gap-2 w-full">
    <div class="flex flex-col w-full gap-1">
      <ChatFooterInputReply v-if="hasInReplyTo" />

      <SendFieldset />
    </div>
  </footer>
</template>
