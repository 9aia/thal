<script setup lang="ts">
import { drawers } from "~/store"
import type { Chat } from "~/types"

import type { MenuItem } from "~~/layers/ui/components/navigation/types"

const emit = defineEmits<{
  (e: "close"): void
}>()

const {
  data,
} = await useServerQuery(() => "/api/chat", {
  queryKey: computed(() => ["chats"]),
})

const conversations = computed<Chat[]>(() => {
  if (!data.value)
    return []

  return data.value.map(chat => ({
    id: chat.id,
    persona: {
      name: chat.contact?.name || chat.persona?.name,
      username: chat.persona?.username,
      avatar: undefined,
    },
    lastMessage: {
      date: now(),
      status: "sent",
      text: "Hello, how can I help you today?",
    },
  }))
})

const isNoteVisible = useCookie("isNoteVisible", {
  default: () => true,
})

const logout = useLogout()

const profileModal = useProfileModal()
const discoverPersonasModal = useDiscoverPersonasModal()

const user = useUser()

const items: MenuItem[] = [
  { id: "profile", action: "profile", name: "Profile", icon: "face", onSubmit: () => profileModal.open(user.value!.username) },
  { id: "discover-personas", name: "Discover Personas", icon: "person_edit", action: "discover-personas", onSubmit: () => discoverPersonasModal.open() },
  { id: "my-personas", name: "My Personas", icon: "person_edit", action: "my-personas", onSubmit: () => drawers.myPersonas = true },
  {
    id: "plan",
    name: "Subscription",
    action: "/api/payment/stripe/create-portal-session",
    method: "post",
    icon: "subscriptions",
    type: "external",
  },
  { id: "settings", name: "Settings", icon: "settings", action: "settings-drawer", onSubmit: () => drawers.settings = true },
  {
    id: "logout",
    name: "Logout",
    action: "/api/auth/logout",
    method: "post",
    icon: "logout",
    onSubmit: logout,
  },
]

function updateRedirectUrl() {
  const route = useRoute()
  const redirectUrl = useRedirectUrl()
  redirectUrl.value = route.path
}
</script>

<template>
  <Navbar class="bg-slate-800">
    <Avatar :name="user!.name" class="w-10 text-sm" type="button" @click="profileModal.open(user!.username)" />

    <div class="dropdown dropdown-end">
      <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
        <Icon>more_vert</Icon>
      </button>

      <Menu :items="items" />
    </div>
  </Navbar>

  <div v-show="isNoteVisible" class="bg-slate-200 px-3 py-4 flex items-center justify-between">
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
      v-for="conversation in conversations"
      :id="conversation.id"
      :key="conversation.id"
      :last-message="conversation.lastMessage"
      :persona="conversation.persona"
      @click="emit('close')"
    />
  </div>

  <div class="absolute bottom-4 right-4">
    <Btn size="md" class="btn-circle btn-primary" @click="drawers.newChat = true">
      <Icon name="add" />
    </Btn>
  </div>
</template>
