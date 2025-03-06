<script setup lang="ts">
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

const modelValue = defineModel<boolean>()
</script>

<template>
  <Modal v-model="modelValue">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4 text-gray-900">
        {{ t("Your subscription expired!") }}
      </h1>

      <p class="font-gray-600 mb-4">
        {{ t("You can manage your billing information to renew your subscription. Thank you for using our app!") }}
      </p>

      <p class="text-sm text-gray-600 w-full flex items-start justify-start">
        <T
          class="flex items-start justify-start flex-col gap-1"
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
    </template>

    <template #actions>
      <div class="flex gap-4">
        <A
          href="/"
          class="btn btn-sm rounded-full px-4 py-2"
          @click="modelValue = false"
        >
          {{ t('Go to home') }}
        </A>

        <form action="/api/payment/stripe/create-portal-session" method="post" class="flex gap-2">
          <Button
            type="submit"
            class="btn-primary"
          >
            {{ t('Manage your billing information') }}
          </Button>
        </form>
      </div>
    </template>
  </Modal>
</template>
