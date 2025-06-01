<template>
  <main
    id="chat-container"
    ref="scrollContainer"
    :tabindex="0"
    class="bg-white w-full py-4 px-4 flex-1 overflow-y-auto relative focus:outline-hidden"
  >
    <div class="sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto">
      <div class="max-w-xs sm:max-w-2xl md:max-w-3xl w-fit mx-auto flex items-center justify-center gap-1 mb-4 text-blue-500 text-xs bg-gradient-2 px-4 py-2 rounded-lg">
        <Icon name="material-symbols:science-outline" class="text-blue-500 text-xl" />
        <p>
          {{ t('This character uses AI to simulate interactions. Please use responsibly.') }}
        </p>
      </div>

      <NonContactProfileCard v-if="!hasContact" />

      <ChatConversation
        :is-error="messageError"
        :is-character-deleted="data.isCharacterDeleted"
        @fix-scroll="goToBottom"
        @resend="handleResend()"
        @delete="handleDelete($event)"
        @edit="handleEdit()"
      />

      <ChatBubbleLoading v-if="isMessagePending && isOnline" />

      <div class="sticky bottom-0 right-0 flex justify-end h-[32px]">
        <Button
          shape="circle"
          size="sm"
          class="transition-opacity duration-500 opacity-0 ease-in-out text-blue-500 border-none"
          :class="{ 'opacity-100': isScrollDownButtonVisible, 'pointer-events-none': !isScrollDownButtonVisible }"
          @click="goToBottom"
        >
          <Icon class="text-lg">
            material-symbols:keyboard-arrow-down
          </Icon>
        </Button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-gradient-2 {
  background: radial-gradient(at bottom, var(--color-blue-50), var(--color-gray-50));
}
</style>
