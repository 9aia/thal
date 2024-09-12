<script setup lang="ts">
import { t } from "@psitta/vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import AppLayout from "~/layouts/app.vue"
import { contactData, drawers } from "~/store"
import queryKeys from "~/queryKeys"

definePageMeta({
  layout: false,
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

const historyQuery = await useServerQuery(() => `/api/chat/history/${params.username}`, {
  queryKey: queryKeys.messages(computed(() => params.username as string)),
})

const scrollContainer = ref<HTMLElement | null>(null)

function fixScroll() {
  if (scrollContainer.value)
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
}

const text = ref("")

const { mutate: sendMessage } = useMutation({
  mutationFn: (data: { type: "text", value: string }) => $fetch(`/api/message/${params.username}`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  async onMutate(data) {
    const newHistory = [...historyQuery.data.value || []]

    newHistory.push({
      id: `${newHistory.length + 1}`,
      from: "user",
      status: "sending",
      message: data.value,
      time: new Date().getTime(),
    })

    queryClient.setQueryData(["messages", computed(() => params.username)], newHistory)
    await nextTick()
    fixScroll()

    text.value = ""
  },
  onSuccess: (newHistory) => {
    if (historyQuery.data.value?.length === 1) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats,
      })
    }

    queryClient.setQueryData(["messages", computed(() => params.username)], newHistory)
    fixScroll()
  },
})

function handleSend() {
  sendMessage({ type: "text", value: text.value })
}

const hasContact = computed(() => {
  return !!data.value?.contact
})

const displayName = computed(() => {
  return data.value?.contact?.name || `@${data.value?.username}`
})

function handleAddContact() {
  drawers.newContact = true
  contactData.value = {
    name: data.value?.name,
    username: data.value?.username,
  }
}
</script>

<template>
  <AppLayout>
    <template #sidebar>
      <Home />
    </template>

    <template #content>
      <Resource :loading="isLoading" :error="isError" @execute="refetch">
        <ChatHeader :name="displayName" :username="data!.username" />

        <main ref="scrollContainer" class="py-4 px-4 sm:px-12 flex-1 overflow-y-auto relative">
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
                <Btn class="btn-outline btn-primary" @click="handleAddContact()">
                  <Icon name="person_add" />
                  Add
                </Btn>
              </div>
            </div>
          </div>

          <Resource
            :loading="historyQuery.isPending.value" :error="historyQuery.isError.value"
            @execute="historyQuery.refetch"
          >
            <ChatConversation :history="historyQuery.data.value! as any" @fix-scroll="fixScroll" />
          </Resource>
        </main>

        <ChatFooter v-model="text" @send="handleSend" />
      </Resource>
    </template>
  </AppLayout>
</template>
