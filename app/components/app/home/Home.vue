<script setup lang="ts">
import queryKeys from "~/queryKeys"
import { drawers, isRootDrawerOpen } from "~/store"

import type { MenuItem } from "~~/layers/ui/components/navigation/types"

const emit = defineEmits<{
  (e: "close"): void
}>()

const {
  data: chats,
} = await useServerQuery(() => "/api/chat", {
  queryKey: queryKeys.chats,
})

const {
  data: lastMessages,
} = await useServerQuery(() => "/api/chat/lastMessages", {
  queryKey: queryKeys.lastMessages,
  initialData: () => chats.value?.map(chat => chat.lastMessages),
})

const isNoteVisible = useCookie("isNoteVisible", {
  default: () => true,
})

const logout = useLogout()

function goToDiscover() {
  isRootDrawerOpen.value = false
  navigateTo("/app/discover")
}

const items: MenuItem[] = [
  { id: "profile", name: "Profile", icon: "face", onClick: () => drawers.profile = true },
  { id: "discover-personas", name: "Discover Characters", icon: "person_edit", onClick: () => goToDiscover() },
  { id: "my-characters", name: "My Characters", icon: "person_edit", onClick: () => drawers.myPersonas = true },
  {
    id: "plan",
    name: "Subscription",
    action: "/api/payment/stripe/create-portal-session",
    method: "post",
    icon: "subscriptions",
    type: "external",
  },
  { id: "settings", name: "Settings", icon: "settings", onClick: () => drawers.settings = true },
  {
    id: "logout",
    name: "Logout",
    action: "/api/auth/logout",
    method: "post",
    icon: "logout",
    onSubmit: logout,
  },
]

function getLastMessageByChatId(chatId: number) {
  if (!lastMessages.value)
    return null

  return lastMessages.value?.find(message => message.chatId === chatId)
}
</script>

<template>
  <Navbar class="bg-slate-800">
    <A href="/app/" class="text-lg font-bold text-teal-500 flex items-center">
      Thal
    </A>

    <div class="dropdown dropdown-end">
      <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
        <Icon>more_vert</Icon>
      </button>

      <Menu :items="items" />
    </div>
  </Navbar>

  <div v-show="isNoteVisible" class="bg-slate-200 px-3 py-4 flex items-center justify-between w-min-full">
    <div class="flex items-center gap-2">
      <div>
        <div class="p-2 flex items-center justify-center">
          <Icon name="waving_hand" class="text-primary" />
        </div>
      </div>

      <div class="flex flex-col">
        <h2 class="text-lg text-slate-800">
          Welcome!
        </h2>
        <p class="text-sm text-slate-800">
          Every conversation is a step closer to your goals.
        </p>
      </div>

      <div>
        <button class="btn btn-md btn-ghost btn-circle" @click="isNoteVisible = false">
          <Icon name="close" class="text-primary" />
        </button>
      </div>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto bg-white">
    <ChatItem
      v-for="chat in chats"
      :key="chat.id"
      :chat="chat"
      :last-message="getLastMessageByChatId(chat.id)!"
      @click="emit('close')"
    />
  </div>

  <div class="absolute bottom-4 right-4">
    <Btn size="md" class="btn-circle btn-primary" @click="drawers.newChat = true">
      <Icon name="add" />
    </Btn>
  </div>
</template>
