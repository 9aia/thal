<script setup lang="ts">
import { t } from '#framework/i18n';
</script>

<template>
  <div class="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
    <div class="card w-[28rem] bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">{{ t('Your free trial is being processed.') }}</h2>

        <p>
          {{ t('If you have any problem, you can contact us at:') }}
          <a href="mailto:support@maratongue.com">support@maratongue.com</a>
        </p>

        <p>
          {{ t('Thank you for choosing us!') }}
        </p>

        <div class="card-actions">
          <A href="/api/payment/stripe/create-portal-session" :localize-href="false" class="btn">
            Manage your billing information
          </A>
        </div>
      </div>
    </div>
  </div>
</template>
