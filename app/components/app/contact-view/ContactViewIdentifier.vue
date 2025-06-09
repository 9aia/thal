<script setup lang="ts">
defineProps<{
  username: string
  avatarName: string
  displayName: string
}>()
</script>

<template>
  <div class="flex flex-col items-center">
    <Avatar
      :name="avatarName"
      size="xl"
      wrapper-class="bg-neutral text-neutral-content"
      class="mx-auto"
    />

    <h2 class="text-xl text-black text-center mt-1">
      {{ displayName }}
    </h2>

    <Username
      :username="username"
      :show-copy="true"
      class="mx-auto"
    />

    <div class="w-full flex justify-center mt-3 gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>
