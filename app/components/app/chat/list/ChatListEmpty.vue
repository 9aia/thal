<script setup lang="ts">
import { t } from '@psitta/vue';
import { isWhatsNewModalOpen } from '~/store';
</script>

<template>
  <div class="w-full text-center p-4">
    <SettingHeader
      :title="t('Chats')"
      icon="material-symbols:chat-rounded"
      icon-class="text-gray-100"
      :description="t('You have no chats yet.')"
    />

    <WhatsNewModal v-model="isWhatsNewModalOpen" />
  </div>
</template>
