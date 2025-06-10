<script setup lang="ts">
import { tv } from 'tailwind-variants'

defineProps<{
  username: string
  avatarName: string
  displayName: string
  actionsClass?: string
}>()

const baseStyles = tv({
  slots: {
    actions: 'w-full flex justify-center mt-3 gap-2',
  },
})

const styles = baseStyles()
</script>

<template>
  <div class="flex flex-col items-center">
    <Avatar
      :name="avatarName"
      size="xl"
      wrapper-class="bg-neutral text-neutral-content"
      class="mx-auto"
    />

    <h2 class="text-xl text-black text-center mt-1 mb-1">
      {{ displayName }}
    </h2>

    <Username
      :username="username"
      :show-copy="true"
      class="mx-auto text-sm"
    />

    <div :class="styles.actions({ class: actionsClass })">
      <slot name="actions" />
    </div>
  </div>
</template>
