<script setup lang="ts">
import { isPastDueModalAlreadyShown, isPastDueModalOpen } from '~/store'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()
const toast = useToast()

onMounted(() => {
  const isPastDue = user.value?.subscriptionStatus === SubscriptionStatus.past_due

  if (isPastDue && !isPastDueModalAlreadyShown.value) {
    isPastDueModalOpen.value = true
  }

  isPastDueModalAlreadyShown.value = isPastDue
})
</script>

<template>
  <div class="w-full max-w-[1700px] h-full bg-white relative left-1/2 -translate-x-1/2">
    <LazyCommonToast v-if="toast.visible.value" />

    <slot />
  </div>
</template>
