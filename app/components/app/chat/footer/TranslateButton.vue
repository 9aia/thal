<script setup lang="ts">
import type { FetchError } from 'ofetch'
import { replies, sendingChatIds } from '~/store'

const props = defineProps<{
  chatId: number
}>()

const text = defineModel<string>('text', {
  default: '',
})

const toast = useToast()
const { t } = useI18nExperimental()
const route = useRoute()
const username = computed(() => route.params.username as string)
const replyMessage = computed(() => replies[username.value])
const isChatSending = computed(() => props.chatId ? sendingChatIds.value.has(props.chatId) : false)

const isTextInputEmpty = useIsTextEmpty(toRef(() => text.value))

const translation = useTranslation({
  queryKey: 'footer-input-translation',
  message: text,
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

  text.value = translation.translation.value!
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
  <Button
    v-if="!isTextInputEmpty"
    class="btn btn-sm btn-circle btn-ghost"
    :disabled="isChatSending"
    :loading="translation.isLoading.value"
    icon="material-symbols:translate-rounded"
    icon-size="xl"
    @click="translation.onTranslate()"
  />
</template>
