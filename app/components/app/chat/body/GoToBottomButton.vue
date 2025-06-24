<script setup lang="ts">
const { isScrollDownButtonVisible, goToBottom } = useChatMainScroll()
</script>

<template>
  <Button
    class="btn btn-circle btn-primary btn-soft transition-opacity duration-500 opacity-0 ease-in-out"
    :class="{ 'opacity-100': isScrollDownButtonVisible, 'pointer-events-none': !isScrollDownButtonVisible }"
    icon="material-symbols:keyboard-arrow-down-rounded"
    :tabindex="isScrollDownButtonVisible ? 0 : -1"
    @click="goToBottom"
  />
</template>
