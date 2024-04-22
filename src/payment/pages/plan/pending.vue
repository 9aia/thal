<script setup lang="ts">
import { refAutoReset, refThrottled, useThrottleFn } from '@vueuse/core';
import { useI18n } from '@psitta/vue'
import { useToast } from '~/src/ui/composables/useToast';

definePageMeta({
  middleware: 'auth',
})

const toast = useToast()
const { t } = useI18n()

const disabled = refAutoReset(false, 3000)

const user = useUser()

const goToApp = async () => {
  disabled.value = true

  const userFetch = await $fetch("/api/user")

  user.value = userFetch

  if(!userFetch?.plan) {
    toast.warn(t('Your plan is being processed yet.'))

    return
  }

  await navigateTo('/explore')
}
</script>

<template>
  <div class="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
    <div class="card w-[28rem] bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          {{ t('Your free trial is being processed.') }}
        </h2>

        <p>
          {{ t('If you have any problem, you can contact us at:') }}
          <a href="mailto:support@maratongue.com">support@maratongue.com</a>
        </p>

        <p>
          {{ t('Thank you for choosing us!') }}
        </p>

        <div class="card-actions">
          <form action="/explore" @submit.prevent="goToApp" method="get">
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="disabled"
            >
              {{ t('Try again') }}
            </button>
          </form>

          <form action="/api/payment/stripe/create-portal-session" method="post">
            <button type="submit" class="btn">
              {{ t('Manage your billing information') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
