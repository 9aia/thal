<script setup lang="ts">
import type { FetchError } from 'ofetch'
import { edition, inReplyTos } from '~/store'

const toast = useToast()
const { t } = useI18nExperimental()

const isEmpty = useIsTextEmpty(toRef(() => edition.content!))
const route = useRoute()
const username = computed(() => route.params.username as string)
const replyMessage = computed(() => inReplyTos[username.value])

const translation = useTranslation({
  queryKey: 'edit-bubble-translation',
  message: toRef(() => edition.content!),
  replyMessageId: computed(() => replyMessage.value ? replyMessage.value.id : undefined),
  chatUsername: username,
  toNative: false,
  refetchOnTranslate: true,
  messageIsBot: false,
})

watch(translation.isLoading, (value) => {
  if (value || translation.isError.value) {
    return
  }

  edition.content = translation.translation.value!
})

watch(translation.error, async (value) => {
  if (!value) {
    return
  }

  const error = value as FetchError
  const errorStatus = error.response?.status

  if (errorStatus === RATE_LIMIT_STATUS_CODE) {
    toast.error(t('You are translating messages too fast. Please wait a moment.'))
    return
  }

  toast.error(t('Failed to translate message'))
})
</script>

<template>
  <div class="flex-1 flex flex-col">
    <label class="flex gap-1 w-full h-full items-center justify-center" for="input">
      <Button
        v-if="!isEmpty"
        class="btn btn-circle btn-sm btn-ghost btn-primary"
        :loading="translation.isLoading.value"
        icon="material-symbols:translate-rounded"
        icon-class="text-xl"
        @click="translation.onTranslate()"
      />

      <ContentEditable
        is="span"
        v-model="edition.content"
        class="prose flex w-full !max-w-full items-center outline-hidden"
        :placeholder="t('Type a message...')"
      />
    </label>
  </div>
</template>
