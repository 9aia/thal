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
  <Modal
    v-model="isOpen"
    show-close-button
    :confirm-text="t('Continue')"
    :title="t('Account Reactivated')"
    no-scroll
    @confirm="isOpen = false"
  >
    <p class="px-8 font-gray-600 mb-4">
      {{ t("Your account is active again — great to have you back! 🎉") }}
    </p>

    <p class="px-8 text-sm text-gray-600">
      {{ t("You now have full access to your content and features.") }}
    </p>
  </Modal>
</template>
