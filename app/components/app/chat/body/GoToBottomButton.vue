<script setup lang="ts">
const { isScrollDownButtonVisible, goToBottom } = useChatHistoryScroll()
</script>

<template>
  <Button
    class="btn btn-sm btn-circle btn-primary btn-soft transition-opacity duration-500 opacity-0 ease-in-out"
    :class="{ 'opacity-100': isScrollDownButtonVisible, 'pointer-events-none': !isScrollDownButtonVisible }"
    @click="goToBottom"
  >
    <Icon class="text-lg" name="material-symbols:keyboard-arrow-down-rounded" />
  </Button>
</template>
