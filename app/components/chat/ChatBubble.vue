<script setup lang="ts">
defineProps<{
  rigth?: boolean
  from: string
  time: string
  message: string
  status: string
  img: string
}>()
</script>

<template>
  <div
    class="chat"
    :class="{
      'chat-start': !rigth,
      'chat-end': rigth,
    }"
  >
    <div class="chat-image avatar">
      <div class="w-10 rounded-full">
        <img
          alt="Avatar image"
          :src="img"
        >
      </div>
    </div>

    <div class="chat-header">
      {{ from }}
      <time class="text-xs opacity-50">{{ time }}</time>
    </div>

    <div class="chat-bubble">
      {{ message }}
    </div>

    <div class="chat-footer opacity-50">
      {{ status }}
    </div>
  </div>
</template>
