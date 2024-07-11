<script setup lang="ts">
import type { Chat } from "~/types"

definePageMeta({
  layout: "app",
})

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
]
</script>

<template>
  <div class="divide-y divide-base-200">
    <ChatItem v-for="convo in convos" v-bind="convo" :key="convo.id" />
  </div>
</template>
