<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  middleware: () => {
    const user = useUser()

    if (!user.value)
      return

    if (user.value.plan)
      return navigateTo('/app')
  },
})
</script>

<template>
  <div class="w-full h-full bg-white">
    <div class="mx-auto py-12">
      <h2 class="text-4xl font-semibold text-slate-800 text-center mb-6">
        {{ t("Subscription") }}
      </h2>

      <div class="gap-8">
        <div class="card mx-auto w-1/2 bg-white border border-teal-500 shadow-xl">
          <div class="card-body">
            <h2 class="card-title text-slate-800 font-bold">
              {{ t('Thal') }}
            </h2>
            <p class="mb-6 text-slate-900">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda, commodi!
            </p>

            <div class="flex items-center justify-center mb-6">
              <span class="text-4xl font-semibold text-primary">R$29.99</span>
              <span class="text-slate-800 ml-1">/mês</span>
            </div>

            <ul class="text-slate-800 list-disc list-inside mb-4">
              <li>{{ t('Real-life conversation simulations') }}</li>
              <li>{{ t('Unlimited personalized exercises') }}</li>
              <li>{{ t('Interactive grammar explanations') }}</li>
              <li>{{ t('Errors and lesson revisions') }}</li>
            </ul>

            <div class="card-actions">
              <form class="w-full" action="/api/payment/stripe/create-checkout-session" method="post">
                <button id="checkout-and-portal-button" type="submit" class="btn btn-primary text-slate-900 w-full">
                  {{ t('Start learning today') }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
