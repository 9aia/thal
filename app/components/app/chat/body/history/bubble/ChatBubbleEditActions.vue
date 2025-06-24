<script setup lang="ts">
import { edition } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)

const { t } = useI18nExperimental()
const { editMessage } = useMessageSender(username)

function handleCancel() {
  edition.editingMessageId = undefined
}

function handleEdit() {
  editMessage({
    id: edition.editingMessageId!,
    content: edition.content,
    inReplyTo: edition.inReplyTo,
  })
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
      @click="handleEdit"
    >
      {{ t('Send') }}
    </Button>
  </div>
</template>
