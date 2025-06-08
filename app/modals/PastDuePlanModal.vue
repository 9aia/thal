<script setup lang="ts">
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

const modelValue = defineModel<boolean>()
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    no-scroll
    :title="t('Your Subscription Expired')"
  >
    <template #default>
      <p class="px-8 text-base text-black mb-4">
        {{ t("Your subscription has expired, so access to core features is currently paused. To keep learning without interruption, please renew your subscription.") }}
      </p>

      <p class="px-8 text-sm text-gray-600 w-full flex items-start justify-start">
        <T
          class="flexitems-start justify-start flex-col gap-1"
          text="Having trouble or need help? Reach out to us at {email}  — we’re here for you."
          :values="{
            email: 'thal@9aia.com',
          }"
        >
          <template #email="{ email }">
            <Link class="!text-brown-500 w-fit !inline-block" :href="`mailto:${email}`">
              {{ email }}
            </Link>
          </template>
        </T>
      </p>
    </template>

    <template #actions>
      <div class="flex gap-4">
        <form action="/api/payment/stripe/create-portal-session" method="post" class="flex gap-2">
          <Button
            type="submit"
            class="btn btn-primary"
          >
            {{ t('Renew Now') }}
          </Button>
        </form>
      </div>
    </template>
  </Modal>
</template>
