<script setup lang="ts">
import { onMounted } from 'vue'
import { t } from '~/lib/psitta/vue'
import A from '~/src/base/components/A.vue'

onMounted(() => {
  const redirectUrl = useCookie('redirect_url', { path: '/' })
  redirectUrl.value = '/checkout/success'

  const cookie = useCookie('free_trial_used', {
    path: '/'
  })
  cookie.value = '1'
})

definePageMeta({
  title: 'Thanks for your order!'
})
</script>

<template>
  <div class="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2">
    <div class="card w-[28rem] bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          {{ t('Your plan is being processed.') }}
        </h2>

        <p>
          {{ t('You will receive an email with your invoice. If you have any problem, you can contact us at:') }}
          <a href="mailto:support@maratongue.com">support@maratongue.com</a>
        </p>

        <p>
          {{ t('Thank you for choosing us!') }}
        </p>

        <div class="card-actions">
          <A href="/explore" class="btn btn-primary">
            Go to app
          </A>

          <form action="/api/payment/stripe/create-portal-session" method="post">
            <button class="btn">
              {{ t('Manage your billing information') }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
