<script setup lang="ts">
useSubscriptionStatusModal()

const toast = useToast()
</script>

<template>
  <div class="w-full max-w-[1700px] h-full bg-white absolute left-1/2 -translate-x-1/2">
    <slot />

    <!-- This cannot be lazy because we need to show it when the user is offline -->

    <CommonToast v-if="toast.visible.value" />
  </div>
</template>
