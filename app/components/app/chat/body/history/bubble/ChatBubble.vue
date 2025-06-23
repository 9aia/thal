<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import { contentEditableRef, edition, inReplyTos } from '~/store'
import { type InReplyTo, MessageStatus } from '~~/db/schema'

const props = defineProps<{
  id: number
  from: 'user' | 'bot'
  time: number
  content: string
  status: MessageStatus

  inReplyTo?: InReplyTo

  showResend: boolean
  showEdit: boolean
  showDelete: boolean

  isCharacterDeleted: boolean
}>()
const emit = defineEmits<{
  (e: 'resend'): void
  (e: 'listen'): void
  (e: 'translate'): void
  (e: 'edit'): void
  (e: 'delete'): void
}>()

const right = computed(() => props.from === 'user')

const { t } = useI18nExperimental()
const locale = useLocale()
const route = useRoute()

const isEditing = computed(() => edition.editing && edition.editingMessageId === props.id)
const username = computed(() => route.params.username as string)

const time = computed(() => new Intl.DateTimeFormat(locale.value, {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(props.time)))

const copyToClipboard = useClipboard(toRef(() => props.content))
const translation = useTranslation({
  queryKey: 'chat-bubble-translation',
  chatUsername: username.value,
  message: computed(() => isEditing.value ? edition.content : props.content),
  replyMessageId: computed(() => props.inReplyTo?.id ? props.inReplyTo.id : undefined),
  refetchOnTranslate: false,
  messageIsBot: computed(() => props.from === 'bot'),
})

function setReply() {
  inReplyTos[username.value] = {
    content: props.content,
    from: props.from,
    id: props.id,
    status: props.status,
  }

  contentEditableRef.value?.focus()
}

const audiableTextRef = ref()

const audiableTextMutation = computed(() => {
  if (!audiableTextRef.value) {
    return null
  }

  return audiableTextRef.value.playMutation as UseMutationReturnType<unknown, Error, void, unknown>
})

async function edit() {
  edition.content = ''
  edition.editingMessageId = props.id

  edition.editing = true
  await nextTick()
  edition.content = props.content
}

function cancelEdit() {
  edition.editing = false
}
</script>

<template>
  <div
    :id="`bubble-container-${id}`"
    class="w-full group bubble-scrollable"
    :class="{
      'chat-start': !right,
      'chat-end': right,
    }"
    tabindex="0"
  >
    <div v-if="inReplyTo" class="px-1 mb-1 translate-y-[1rem]">
      <ChatInReplyTo
        :is="inReplyTo"
        :username="username"
      />
    </div>

    <div class="flex items-center gap-2 bg-transparent p-0" :class="[isEditing ? 'w-full' : '']">
      <ChatAside
        v-if="right && !isEditing"
        :right="!!right"
        :translation="translation"
        :is-character-deleted="isCharacterDeleted"
        @set-reply="setReply"
      />

      <div
        class="chat-bubble-bg flex flex-col rounded-3xl px-2 py-2 min-w-32 bg-gray-50"
        :class="[right ? 'rounded-br-md' : 'rounded-bl-md', !isEditing ? 'max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]' : 'w-full']"
      >
        <div class="px-2">
          <AudibleText v-if="!isEditing" ref="audiableTextRef" :text="content" />

          <EditBubble v-else />
        </div>

        <div v-if="translation.isOpen.value" class="px-1 my-1">
          <ChatBubbleTranslation :translation="translation" />
        </div>

        <template v-if="isEditing">
          <div class="flex justify-end gap-1">
            <Button
              class="btn btn-sm btn-ghost btn-neutral"

              icon="material-symbols:close-rounded"
              icon-class="text-xl"
              @click="cancelEdit"
            >
              {{ t('Cancel') }}
            </Button>

            <Button
              class="btn btn-sm btn-ghost btn-neutral"

              icon="material-symbols:send-outline-rounded"
              icon-class="text-xl"
              @click="emit('edit')"
            >
              {{ t('Send') }}
            </Button>
          </div>
        </template>

        <template v-else>
          <div class="flex items-center px-2 gap-1" :class="{ 'justify-end': right }">
            <time class="text-gray-300 text-xs opacity-90">{{ time }}</time>
            <MessageIcon v-if="right" :status="status" />
          </div>
        </template>
      </div>

      <ChatAside
        v-if="!right && !isEditing"
        :is-character-deleted="isCharacterDeleted"
        :right="!!right"
        :translation="translation"
        @set-reply="setReply"
      />
    </div>

    <div class="chat-footer opacity-90 flex items-center mt-1" :class="{ 'flex-row-reverse': !right }">
      <div class="flex items-center min-h-8" :class="{ 'flex-row-reverse': !right }">
        <Button
          v-if="(from === 'user') && showEdit && !isEditing"
          class="btn btn-sm btn-circle btn-ghost btn-primary sm:hidden group-hover:block"

          icon="material-symbols:edit-outline-rounded"
          icon-class="text-xl"
          @click="edit"
        />

        <Button
          v-if="(from === 'user') && showResend && !isEditing"
          class="btn btn-sm btn-circle btn-ghost btn-secondary sm:hidden group-hover:block"

          icon="material-symbols:refresh-rounded"
          icon-class="text-xl"
          @click="emit('resend')"
        />

        <Button
          v-if="!isEditing"
          class="btn btn-sm btn-circle btn-ghost btn-neutral sm:hidden group-hover:block"

          icon="material-symbols:content-copy-outline-rounded"
          icon-class="text-xl"
          @click="copyToClipboard"
        />

        <Button
          v-if="!isEditing && status !== MessageStatus.error"
          class="btn btn-sm btn-circle btn-ghost btn-neutral sm:hidden group-hover:block"
          no-disable-on-loading
          :loading="audiableTextMutation?.isPending.value"

          icon="material-symbols:volume-up-outline-rounded"
          icon-class="text-xl"
          @click="audiableTextMutation?.mutate()"
        />

        <Button
          v-if="!isEditing && status !== MessageStatus.error"
          class="btn btn-circle btn-sm btn-ghost btn-neutral sm:hidden group-hover:block"
          :loading="translation.isLoading.value"
          :disabled="isCharacterDeleted"

          icon="material-symbols:translate-rounded"
          icon-class="text-xl"
          @click="translation.onTranslate()"
        />

        <Button
          v-if="(from === 'user') && showDelete"
          class="btn btn-sm btn-circle btn-ghost btn-error sm:hidden group-hover:block"

          icon="material-symbols:delete-outline-rounded"
          icon-class="text-xl"
          @click="emit('delete')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.bubble-scrollable {
  scroll-margin: 2rem;
}

.animate-highlight {
  animation: highlight 1s ease-in-out;
}

@keyframes highlight {

  0%,
  100% {
    background: var(--color-gray-50);
  }

  50% {
    background: var(--color-cyan-100);
  }
}
</style>
