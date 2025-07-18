<script setup lang="ts">
import { onMounted } from 'vue'
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

definePageMeta({
  title: 'Checkout success',
  middleware: 'plan-non-active',
  layout: 'site',
  layoutTransition: false,
})

onMounted(() => {
  const cookie = useCookie('free_trial_used', {
    path: '/',
  })
  cookie.value = '1'
})
</script>

<template>
  <div class="site-container w-full relative h-[calc(100vh-64px)]">
    <div class="text-center w-full max-w-2xl absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Checkout with Success!') }}
      </h1>

      <p class="text-black text-sm">
        {{ t('You will receive an email with your invoice. Thank you for chosing our app!') }}
      </p>

      <div class="flex items-center justify-center h-fit mt-4">
        <form action="/api/payment/stripe/create-portal-session" method="post" class="flex gap-2">
          <A href="/app" class="btn btn-primary">
            {{ t('Check access to the app') }}
          </A>

          <Button type="submit" class="btn btn-soft btn-primary">
            {{ t('Manage your billing information') }}
          </Button>
        </form>
      </div>

      <p class="text-black text-sm mt-4">
        {{ t('You will be able to access the app as soon as possible.') }}
      </p>

      <p class="text-sm text-gray-600 mt-4 w-full flex items-center justify-center">
        <T
          class="flex flex-col items-center justify-center"
          text="If you have any problem, you can contact us at: {link}"
          :values="{
            link: 'suporte@thal.9aia.com',
          }"
        >
          <template #link="{ link }">
            <Link class="!text-brown-500 w-fit" :href="`mailto:${link}`">
              {{ link }}
            </Link>
          </template>
        </T>
      </p>
    </div>
  </div>
</template>
