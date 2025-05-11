<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import MessageIcon from './MessageIcon.vue'
import type { MessageStatus } from '~/types'
import { contentEditableRef, edition, replies } from '~/store'

const props = defineProps<{
  id: number
  from: 'user' | 'bot'
  time: number
  message: string
  replyMessage?: string
  replyingId?: number | null
  replyFrom?: 'user' | 'bot'
  status: MessageStatus
  img: string
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

const copyToClipboard = useClipboard(toRef(props, 'message'))
const translation = useTranslation({
  chatUsername: username.value,
  message: computed(() => isEditing.value ? edition.message : props.message),
  replyMessageId: computed(() => props.replyingId ? props.replyingId : undefined),
  refetchOnTranslate: false,
  messageIsBot: computed(() => props.from === 'bot'),
})

function setReply() {
  replies[username.value] = {
    message: props.message,
    from: props.from,
    id: props.id,
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
  edition.message = ''
  edition.editingMessageId = props.id

  edition.editing = true
  await nextTick()
  edition.message = props.message
}

function cancelEdit() {
  edition.editing = false
}
</script>

<template>
  <div
    :id="`bubble-container-${id}`" class="w-full group bubble-scrollable" :class="{
      'chat-start': !right,
      'chat-end': right,
    }"
  >
    <div v-if="!!replyMessage" class="px-1 mb-1 translate-y-[1rem]">
      <ChatReply
        :reply-message="replyMessage" :replying-id="replyingId!" :username="username"
        :reply-from="replyFrom!"
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
          <AudibleText v-if="!isEditing" ref="audiableTextRef" :text="message" />

          <EditBubble v-else />
        </div>

        <div v-if="translation.isOpen.value" class="px-1 my-1">
          <ChatBubbleTranslation :translation="translation" />
        </div>

        <template v-if="isEditing">
          <div class="flex justify-end gap-1">
            <Button
              size="xs"
              @click="cancelEdit"
            >
              <Icon class="text-base">
                material-symbols:close
              </Icon>
              {{ t('Cancel') }}
            </Button>

            <Button
              size="xs"
              @click="emit('edit')"
            >
              <Icon class="text-base">
                material-symbols:send-outline
              </Icon>
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
          class="btn-ghost btn-gray text-blue-500 sm:hidden group-hover:block"
          size="sm"
          shape="circle"
          @click="edit"
        >
          <Icon class="text-base">
            material-symbols:edit-outline
          </Icon>
        </Button>

        <Button
          v-if="(from === 'user') && showResend && !isEditing"
          shape="circle"
          class="btn-ghost btn-gray text-magenta-500 sm:hidden group-hover:block"
          @click="emit('resend')"
        >
          <Icon class="text-base">
            material-symbols:refresh
          </Icon>
        </Button>

        <Button
          v-if="!isEditing"
          shape="circle"
          class="text-gray-800 btn-ghost sm:hidden group-hover:block"
          @click="copyToClipboard"
        >
          <Icon class="text-base">
            material-symbols:content-copy-outline
          </Icon>
        </Button>

        <Button
          v-if="!isEditing && status !== 'error'"
          shape="circle"
          class="text-gray-800 btn-ghost sm:hidden group-hover:block"
          no-disable-on-loading
          :loading="audiableTextMutation?.isPending.value" @click="audiableTextMutation?.mutate()"
        >
          <Icon class="text-base">
            material-symbols:volume-up-outline
          </Icon>
        </Button>

        <Button
          v-if="!isEditing && status !== 'error'"
          shape="circle"
          class="text-gray-800 btn-ghost sm:hidden group-hover:block"
          :loading="translation.isLoading.value"
          :disabled="isCharacterDeleted"
          @click="translation.onTranslate()"
        >
          <Icon class="text-base">
            material-symbols:translate
          </Icon>
        </Button>

        <Button
          v-if="(from === 'user') && showDelete"
          shape="circle"
          class="btn-ghost btn-gray text-red-500 sm:hidden group-hover:block"
          @click="emit('delete')"
        >
          <Icon class="text-base">
            material-symbols:delete-outline
          </Icon>
        </Button>
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
    @apply bg-gray-50;
  }

  50% {
    @apply bg-cyan-100;
  }
}
</style>
