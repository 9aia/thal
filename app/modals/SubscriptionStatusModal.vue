<script setup lang="ts">
import { T } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'
import { SubscriptionStatus } from '~~/db/schema'

const open = defineModel<boolean>()

const { t } = useI18nExperimental()
const toast = useToast()
const user = useUser()
const subscriptionStatusModalOpen = useCookie('thal_subscription_status_modal_opened', {
  default: () => [] as SubscriptionStatus[],
})

const subscriptionQuery = useSubscriptionQuery()
await subscriptionQuery.suspense()

onMounted(() => {
  watch(subscriptionQuery.error, (error) => {
    if (error) {
      toast.error(t('Something went wrong getting your subscription status.'), 0)
    }
  }, { immediate: true })
})

const title = computed(() => {
  if (user.value?.subscriptionStatus === null || user.value?.subscriptionStatus === SubscriptionStatus.not_subscribed) {
    if (subscriptionStatusModalOpen.value.includes(SubscriptionStatus.not_subscribed)) {
      if (subscriptionQuery.data.value?.processingTrialActivation) {
        return t('Oops! Almost There...')
      }

      return t('Unlock Thal')
    }

    return t('Welcome to Thal!')
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.incomplete) {
    return t('Oops! Almost There...')
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.incomplete_expired) {
    return t('Looks like we missed you!')
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.paused) {
    return t('Ready to Reconnect with English?')
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.canceled) {
    if (subscriptionQuery.data.value?.cameFromCheckoutInTrialMode) {
      return t('Time to make Thal official!')
    }

    return t('Your Thal subscription has been canceled')
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.unpaid) {
    return t('Your Thal subscription is unpaid')
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.past_due) {
    return t('Uh oh, looks like we missed a payment!')
  }

  return undefined
})
</script>

<template>
  <Modal
    v-if="subscriptionQuery.isSuccess.value"
    v-model="open"
    show-close-button
    no-scroll
    :title="title"
  >
    <template #default>
      <p class="px-8 text-base text-black mb-4">
        <template v-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
          <template v-if="subscriptionQuery.data.value?.processingTrialActivation">
            <template v-if="subscriptionStatusModalOpen.includes(SubscriptionStatus.not_subscribed)">
              {{ t("Your trial may be still being processed and it\'ll be active soon. We appreciate your patience!") }}
            </template>
            <template v-else>
              {{ t("Checkout's done. Thank you for joining! Please note that your trial may still be processing and will be active soon.") }}
            </template>
          </template>

          <template v-else>
            {{ t("Ready to learn English like you're just texting a friend? Start now and boost your English.") }}
          </template>
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete">
          {{ t("To get your Thal subscription up and running, we just need you to complete your payment within 23 hours. Sometimes this means a quick authentication, or your payment might still be processing. Once that's done, you'll be all set to start chatting and boosting your English!") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete_expired">
          {{ t("It seems your Thal subscription didn't quite make it through the initial setup, and the payment wasn't completed within 23 hours. No worries, you won't be billed. If you'd like to dive into English learning with Thal, just start fresh whenever you're ready!") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.paused">
          {{ t("Your subscription is paused. Resume now to keep improving your English!") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.canceled">
          <template v-if="subscriptionQuery.data.value?.cameFromCheckoutInTrialMode">
            {{ t("Your trial has ended, and to keep chatting with thals, you just need to set up a payment method. It's quick, easy, and means you won't miss out on any more conversations!") }}
          </template>
          <template v-else>
            {{ t("It looks like your subscription has been canceled, possibly due to issues with recent payments. You'll need to subscribe again if you'd like to continue learning English with Thal. We're ready whenever you are!") }}
          </template>
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.unpaid">
          {{ t("It looks like your latest invoice hasn't been paid, and your access is currently on hold. To resume chatting and improving your English, just pay your most recent invoice.") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.past_due">
          {{ t("It looks like your latest payment didn't go through. No worries, your subscription is still active and we'll keep trying for the next week (up to 4 times) to get it sorted. If payments don't go through, your subscription will be marked as canceled. To get things back on track right away, simply pay your most recent invoice. Once that's done, you'll be good to go!") }}
        </template>
      </p>

      <p class="px-8 text-xs text-gray-600 w-full flex items-start justify-start">
        <T
          class="flexitems-start justify-start flex-col gap-1"
          text="Having trouble or need help? Reach out to us at {email}  — we’re here for you."
          :values="{
            email: 'suporte@thal.9aia.com',
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
        <SubscriptionStatusForm />
      </div>
    </template>
  </Modal>
</template>
