<script setup lang="ts">
import { edition } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)

const { t } = useI18nExperimental()
const { editMessage } = useMessageSender(username)

function handleCancel() {
  edition.messageId = undefined
}

function handleSave() {
  editMessage({
    id: edition.messageId!,
    time: now().getTime(),
    content: edition.content!,
    inReplyTo: edition.inReplyTo,
  })

  edition.messageId = undefined
  edition.content = undefined
  edition.inReplyTo = undefined
}
</script>

<template>
  <div class="flex justify-end gap-1">
    <Button
      class="btn btn-sm btn-ghost btn-neutral"
      icon="material-symbols:close-rounded"
      @click="handleCancel"
    >
      {{ t('Cancel') }}
    </Button>

    <Button
      class="btn btn-sm btn-ghost btn-primary"
      icon="material-symbols:send-outline-rounded"
      @click="handleSave"
    >
      {{ t('Send') }}
    </Button>
  </div>
</template>
