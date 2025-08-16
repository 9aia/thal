<script lang="ts" setup>
import { inReplyTos } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)
const hasInReplyTo = computed(() => !!inReplyTos[username.value])

const { t } = useI18nExperimental()
</script>

<template>
  <footer class="bg-white flex items-end justify-center gap-2 w-full">
    <div class="flex flex-col w-full gap-1">
      <ChatFooterInputReply v-if="hasInReplyTo" />

      <div class="flex flex-col items-center w-full">
        <SendFieldset class="pb-0" />

        <ExpandableWarning
          :initial-text="t('This is A.I. and not a real person. Treat everything it says as fiction.')"
          :expanded-text="t('What is said should not be relied upon as fact or advice.')"
          :read-more-text="t('Read more')"
          :read-less-text="t('Read less')"
        />
      </div>
    </div>
  </footer>
</template>
