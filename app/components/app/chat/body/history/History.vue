<script setup lang="ts">
const route = useRoute()
const username = computed(() => route.params.username as string)

const historyQuery = useHistoryQuery(username)
</script>

<template>
  <CommonResource
    :for="historyQuery"
  >
    <template #empty>
      <span />
    </template>

    <template #default>
      <div class="space-y-2">
        <ChatBubble
          v-for="item, index in historyQuery.data.value"
          :id="item.id"
          :key="item.id"
          :status="item.status"
          :content="item.content"
          :time="item.time"
          :from="item.from"

          :in-reply-to="item.inReplyTo ? { ...item.inReplyTo } : undefined"
          :is-last="index === (historyQuery.data.value!.length - 1)"
        />
      </div>
    </template>
  </CommonResource>
</template>
