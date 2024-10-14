<script setup lang="ts">
import { t } from "@psitta/vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import AppLayout from "~/layouts/app.vue"
import queryKeys from "~/queryKeys"
import { replies } from "~/store"

definePageMeta({
  layout: false,
  middleware: "premium",
})

const route = useRoute()
const params = route.params
const queryClient = useQueryClient()

const {
  data,
  isLoading,
  isError,
  refetch,
} = await useServerQuery(() => `/api/chat/${params.username}` as `/api/chat/:username`, {
  queryKey: queryKeys.chat(computed(() => params.username as string)),
})

const scrollContainer = ref<HTMLElement | null>(null)

async function fixScroll() {
  await nextTick()

  setTimeout(() => {
    if (scrollContainer.value)
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }, 0)
}

const text = ref("")

interface SendMessageData {
  type: "text"
  value: string
  refresh: boolean
  replyingId?: number
  replyMessage?: string
}

const replying = computed(() => {
  const username = route.params.username as string
  return replies[username]
})

function emptyInput() {
  const username = route.params.username as string
  delete replies[username]

  text.value = ""
}

const { mutate: sendMessage, isError: mutationError } = useMutation({
  mutationFn: (data: SendMessageData) => $fetch(`/api/message/${params.username}`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  async onMutate(newMessage) {
    if (newMessage.refresh)
      return

    const newHistory = [...data.value.history || []]

    newHistory.push({
      id: newHistory.length + 1,
      from: "user",
      status: "sending",
      message: addReplyToMessage(newMessage.value, replying.value?.message),
      time: new Date().getTime(),
    })

    queryClient.setQueryData(queryKeys.chat(params.username as string), {
      ...data.value,
      history: newHistory,
    })

    emptyInput()
    fixScroll()
  },
  onError: async () => {
    const newHistory = [...data.value.history || []]

    const lastMessage = newHistory[newHistory.length - 1]

    newHistory[newHistory.length - 1] = {
      ...lastMessage,
      status: "error",
    }

    queryClient.setQueryData(queryKeys.chat(params.username as string), {
      ...data.value,
      history: newHistory,
    })

    fixScroll()
  },
  onSuccess: async (newHistory) => {
    if (data.value.history.length === 1) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats,
      })
    }

    queryClient.setQueryData(queryKeys.chat(params.username as string), {
      ...data.value,
      history: newHistory,
    })

    fixScroll()
  },
})

function handleSend() {
  sendMessage({
    type: "text",
    value: text.value,
    refresh: false,
    replyingId: replying.value?.id,
    replyMessage: replying.value?.message,
  })
}

function handleResend() {
  const lastMessage = data.value.history[data.value.history.length - 1]

  if (lastMessage.status === "error") {
    sendMessage({
      type: "text",
      value: lastMessage.message,
      refresh: true,
      replyingId: replying.value?.id,
      replyMessage: replying.value?.message,
    })
  }
}

const { hasContact, displayName, addContact } = useContactInfo(data)
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <Home />
    </template>

    <template #content>
      <Resource :loading="isLoading" :error="isError" @execute="refetch">
        <ChatHeader :name="displayName" :username="data!.username" :has-contact="hasContact" :add-contact="addContact" />

        <main ref="scrollContainer" class="bg-slate-200 py-4 px-2 sm:px-12 flex-1 overflow-y-auto relative">
          <div class="mb-4 text-slate-800 text-xs bg-orange-100 px-4 py-2 rounded-lg flex gap-1">
            <Icon name="science" style="font-size: 1.15rem" />
            <p>
              {{ t('This app is for educational and entertainment purposes only. Content and interactions do not represent professional instruction. Verify information independently and use responsibly.') }}
            </p>
          </div>

          <div
            v-if="!hasContact"
            class="card bg-neutral text-neutral-content text-center sm:max-w-lg mx-auto"
          >
            <div class="card-body">
              <div tabindex="0" role="button" class="mx-auto w-20 h-20 btn btn-ghost btn-circle avatar">
                <div class="w-20 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  >
                </div>
              </div>

              <h2 class="text-slate-900 text-center mb-1">
                {{ displayName }}
              </h2>
              <small class="text-slate-600 text-xs">~ {{ data?.description }}</small>

              <p class="mb-2 text-slate-600 text-sm">
                {{ t('Not a contact') }}
              </p>

              <div class="card-actions justify-center">
                <Btn class="btn-outline btn-primary" @click="addContact()">
                  <Icon name="person_add" />
                  Add
                </Btn>
              </div>
            </div>
          </div>

          <ChatConversation
            :history="data.history"
            :is-error="mutationError"
            @fix-scroll="fixScroll"
            @resend="handleResend()"
          />
        </main>

        <ChatFooter v-model="text" @send="handleSend()" />
      </Resource>
    </template>
  </AppLayout>
</template>
