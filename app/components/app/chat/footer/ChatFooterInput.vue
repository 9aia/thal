<template>
  <div class="flex gap-2 px-3 py-2">
    <div class="flex-1 flex flex-col tooltip-center bg-gradient-2" :class="{ tooltip: isCharacterDeleted }" :data-tip="t('You can\'t message this character — they have been deleted.')">
      <label class="input bg-gray-50 flex gap-1 w-full h-full items-center justify-center p-2 textarea" for="input">
        <Button
          v-if="!isEmpty" size="sm" shape="circle" :disabled="isChatSending || undefined"
          class="btn-ghost" :loading="translation.isLoading.value" @click="translation.onTranslate()"
        >
          <Icon name="material-symbols:translate" class="text-base" />
        </Button>

        <ContentEditable
          is="span" id="input" ref="contentEditableRef" v-model="text"
          :disabled="isCharacterDeleted"
          class="flex w-full items-center text-sm outline-hidden"
          :placeholder="t('Type a message...')"
          @keydown.enter="handleSend"
        />
      </label>
    </div>

    <Button
      v-if="!isEmpty"
      class="btn-ghost"
      size="md"
      shape="circle"
      :disabled="isChatError || isChatSending || undefined"
      @click="handleSend"
    >
      <Icon :name="icon" />
    </Button>
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";

.tooltip::before {
  @apply px-4 py-2 rounded-lg text-blue-500 max-w-xs sm:max-w-2xl md:max-w-3xl text-sm;
  background: radial-gradient(at bottom, var(--color-blue-50), var(--color-gray-50));
}
</style>
