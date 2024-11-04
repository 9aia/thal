<script lang="ts" setup>
import { useMagicKeys } from "@vueuse/core"
import { useQueryClient } from "@tanstack/vue-query"
import { useI18n } from "@psitta/vue"
import { useEventListener } from "@vueuse/core/index.cjs"
import { replies } from "~/store"
import queryKeys from "~/queryKeys"

const emit = defineEmits<{
  (e: "send"): void
}>()

const text = defineModel<string>({
  required: true,
})

const queryClient = useQueryClient()

const { t } = useI18n()
const route = useRoute()

const username = computed(() => route.params.username as string)

const {
  shift,
} = useMagicKeys()

const isEmpty = computed(() => !text.value.trim())
const icon = computed(() => {
  return isEmpty.value ? "mic" : "send"
})

function handleEnter(e: Event) {
  if (!text.value.trim()) {
    e.preventDefault()
    return
  }

  if (!shift.value) {
    e.preventDefault()
    emit("send")
  }
}

function removeReply() {
  delete replies[username.value]
}

const replying = computed(() => replies[username.value])

const data = computed(() => queryClient.getQueryData(queryKeys.chat(username)))
const { displayName } = useContactInfo(data)

const replyDisplayName = computed(() => replying.value.from === "user"
  ? t("You")
  : displayName.value,
)

const contentEditableRef = ref()

onMounted(() => {
  const chatContainer = document.querySelector("#chat-container")

  useEventListener(chatContainer, "keydown", () => {
    contentEditableRef.value?.focus()
  })

  contentEditableRef.value?.focus()
})

const isReplying = computed(() => !!replies[username.value])
const replyMessage = computed(() => replies[username.value])
</script>

<template>
  <footer class="px-3 py-2 bg-white flex items-end justify-center gap-2">
    <div class="flex-1 flex flex-col">
      <label class="input flex flex-col w-full h-full items-center justify-center p-2 textarea" for="input">
        <div
          v-if="isReplying"
          class="rounded-md border-l-4 border-teal-500 bg-slate-400/40 p-1 px-2 mb-3 relative w-full"
        >
          <h3 class="text-sm font-medium text-teal-600">
            {{ replyDisplayName }}
          </h3>
          <p class="text-xs text-slate-600 line-clamp-3">
            {{ replyMessage.message }}
          </p>

          <div role="button" class="btn btn-xs btn-ghost btn-circle avatar absolute top-1 right-1" @click="removeReply">
            <Icon name="close" style="font-size: 1rem" />
          </div>
        </div>

        <ContentEditable
          is="span"
          id="input"
          ref="contentEditableRef"
          v-model="text"
          class="flex w-full items-center text-sm outline-none"
          placeholder="Type a message"
          @keydown.enter="handleEnter"
        />
      </label>
    </div>

    <div v-if="!isEmpty" role="button" class="btn btn-ghost btn-circle avatar" @click="emit('send')">
      <Icon :name="icon" />
    </div>
  </footer>
</template>
