<script setup lang="ts">
import { t } from '@psitta/vue'

const userReactivatedCookie = useCookie('user_reactivated')

function close() {
  userReactivatedCookie.value = undefined
}
</script>

<template>
  <Modal
    show-close-button
    :confirm-text="t('Continue')"
    :title="t('Account Reactivated')"
    no-scroll
    @confirm="close"
    @update:model-value="(val) => !val && close()"
  >
    <p class="px-8 font-gray-600 mb-4">
      {{ t("Your account is active again — great to have you back! 🎉") }}
    </p>

    <p class="px-8 text-sm text-gray-600">
      {{ t("You now have full access to your content and features.") }}
    </p>
  </Modal>
</template>
