<script setup lang="ts">
import type { Chat } from "~/types"

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

const isNoteVisible = ref(true)
</script>

<template>
  <HomeNavbar />

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
    <ChatItem v-for="convo in convos" v-bind="convo" :key="convo.id" />
  </div>

  <div class="absolute bottom-4 right-4">
    <label for="new-chat-drawer" class="btn btn-circle btn-primary">
      <Icon name="add" />
    </label>
  </div>
</template>
