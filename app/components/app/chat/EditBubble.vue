<script setup lang="ts">
import { t } from '@psitta/vue'
import { edition, replies } from '~/store'

const isEmpty = useIsTextEmpty(toRef(() => edition.message))
const route = useRoute()
const username = computed(() => route.params.username as string)
const replyMessage = computed(() => replies[username.value])

const translation = useTranslation({
  message: toRef(() => edition.message),
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

  edition.message = translation.translation.value!
})
</script>

<template>
  <div class="flex-1 flex flex-col">
    <label class="flex gap-1 w-full h-full items-center justify-center" for="input">
      <Button
        v-if="!isEmpty"
        size="sm"
        shape="circle"
        class="btn-ghost"
        :loading="translation.isLoading.value"
        @click="translation.onTranslate()"
      >
        <Icon name="material-symbols:translate" class="text-base" />
      </Button>

      <ContentEditable
        is="span"
        v-model="edition.message"
        class="prose flex w-full !max-w-full items-center outline-none"
        :placeholder="t('Type a message...')"
      />
    </label>
  </div>
</template>
