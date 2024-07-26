<script setup lang="ts">
import { t } from "@psitta/vue"

definePageMeta({
  middleware: "user",
})
</script>

<template>
  <div class="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
    <div class="card w-[28rem] bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          {{ t('Your subscription expired!') }}
        </h2>

        <p>
          {{ t('If you have any problem, you can contact us at:') }}
          <a href="mailto:support@maratongue.com">support@maratongue.com</a>
        </p>

        <p>
          {{ t('Thank you for choosing us!') }}
        </p>

        <div class="card-actions">
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
