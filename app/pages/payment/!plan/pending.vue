<script setup lang="ts">
import { refAutoReset } from '@vueuse/core'
import { T, useI18n } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

definePageMeta({
  title: 'Your free trial is being processed',
  middleware: 'auth',
})

useAutoRedirect()

const toast = useToast()
const { t } = useI18n()

const disabled = refAutoReset(false, 3000)

const user = useUser()

async function goToApp() {
  disabled.value = true

  const userFetch = (await $fetch('/api/user')) as any

  user.value = userFetch

  if (!userFetch?.plan) {
    toast.warn(t('Your subscription is being processed yet.'))

    return
  }

  await navigateTo('/app')
}
</script>

<template>
  <div class="w-full relative" style="height: calc(100vh - 64px)">
    <div class="text-center w-full max-w-2xl absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full text-center p-4">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Your free trial is being processed.') }}
      </h1>

      <p class="text-black text-sm">
        {{ t('You will receive access to the app as soon as possible.') }}
      </p>

      <div class="flex items-center justify-center flex-wrap h-fit mt-4 gap-2">
        <form action="/app" method="get" @submit.prevent="goToApp">
          <Button type="submit" class="py-4 bg-cyan-500 border-none flex gap-1" :disabled="disabled">
            {{ t('Try access') }}
          </Button>
        </form>

        <form action="/api/payment/stripe/create-portal-session" method="post" class="flex gap-2">
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
