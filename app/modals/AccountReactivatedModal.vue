<script setup lang="ts">
import { t } from '@psitta/vue'

const userReactivatedCookie = useCookie('user_reactivated')
const isOpen = ref(!!userReactivatedCookie.value)

onMounted(() => {
  if (userReactivatedCookie) {
    userReactivatedCookie.value = ''
  }
})
</script>

<template>
  <Modal v-model="isOpen" show-close-button :confirm-text="t('Continue')" @confirm="isOpen = false">
    <template #default>
      <h1 class="text-2xl mb-2 mt-4 text-gray-900">
        {{ t("Account Reactivated") }}
      </h1>

      <p class="font-gray-600 mb-4">
        {{ t("Your account has been successfully reactivated. Welcome back! 🎉") }}
      </p>

      <p class="text-sm text-gray-600">
        {{ t("You can now access your content and resume using all features.") }}
      </p>
    </template>
  </Modal>
</template>
