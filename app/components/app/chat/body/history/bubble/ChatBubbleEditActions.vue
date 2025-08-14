<script setup lang="ts">
import { edition } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)

const { t } = useI18nExperimental()
const sendMessageMutation = useSendMessage(username)

function handleCancel() {
  edition.messageId = undefined
}

function handleSave() {
  sendMessageMutation.retryMutate()
}
</script>

<template>
  <div
    class="flex justify-end gap-1"
    @click.stop
  >
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
