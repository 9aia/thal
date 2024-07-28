<script setup lang="ts">
import type { Chat } from "~/types"

import type { MenuItem } from "~~/layers/ui/components/navigation/types"

const emit = defineEmits<{
  (e: "open", emitValue: string): void
  (e: "close"): void
}>()

const convos: Chat[] = [
  {
    id: "1",
    user: {
      name: "Batou",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "sending",
      text: "Hi Motoko (loading)!",
    },
  },
  {
    id: "2",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "seen",
      text: "Hi Motoko (seen)!",
    },
  },
  {
    id: "3",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "sent",
      text: "Hi Motoko (sent)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
  {
    id: "4",
    user: {
      name: "Pazu",
      avatar: "b",
    },
    lastMessage: {
      date: new Date("2024-07-06T12:00:00Z"),
      status: "received",
      text: "Hi Motoko (received)!",
    },
  },
]

const isNoteVisible = useCookie("isNoteVisible", {
  default: () => true,
})

const logout = useLogout()

const profileModal = useProfileModal()

const user = useUser()

const items: MenuItem[] = [
  { id: "profile", action: "profile", name: "Profile", icon: "face", onSubmit: () => profileModal.open(user.value!.username) },
  {
    id: "plan",
    name: "Subscription",
    action: "/api/payment/stripe/create-portal-session",
    method: "post",
    icon: "subscriptions",
    type: "external",
  },
  { id: "settings", name: "Settings", icon: "settings", emit: "settings-drawer" },
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

      <Menu :items="items" @action="emit('open', $event)" />
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
    <ChatItem v-for="convo in convos" v-bind="convo" :key="convo.id" @click="emit('close')" />
  </div>

  <div class="absolute bottom-4 right-4">
    <Btn size="md" class="btn-circle btn-primary" @click="emit('open', 'new-chat')">
      <Icon name="add" />
    </Btn>
  </div>
</template>
