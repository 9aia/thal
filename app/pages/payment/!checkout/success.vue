<script setup lang="ts">
import { onMounted } from 'vue'
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

useAutoRedirect()

onMounted(() => {
  const cookie = useCookie('free_trial_used', {
    path: '/',
  })
  cookie.value = '1'
})

definePageMeta({
  title: 'Checkout success',
  middleware: 'auth',
})
</script>

<template>
  <div class="w-full relative" style="height: calc(100vh - 64px)">
    <div class="text-center w-full max-w-2xl absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Checkout with success!') }}
      </h1>

      <p class="text-black text-sm">
        {{ t('Thank you for using our app! You will receive an email with your invoice.') }}
      </p>

      <div class="flex items-center justify-center h-fit mt-4">
        <form action="/api/payment/stripe/create-portal-session" method="post" class="flex gap-2">
          <A href="/app" class="h-fit btn py-4 rounded-full bg-cyan-500 border-none flex gap-1">
            {{ t('Go to app') }}
          </A>

          <Button type="submit" class="py-4 bg-cyan-500 border-none flex gap-1">
            {{ t('Manage your billing information') }}
          </Button>
        </form>
      </div>

      <p class="text-sm text-gray-600 mt-4 w-full flex items-center justify-center">
        <T
          class="flex flex-col items-center justify-center"
          text="If you have any problem, you can contact us at: {link}"
          :values="{
            link: 'thal@9aia.com',
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
