<script setup lang="ts">
import { t } from '@psitta/vue'

const user = useUser()

const isPastDueVisible = computed(() => {
  if (!user.value) {
    return false
  }

  return isPlanPastDue(user.value)
})
</script>

<template>
  <AppNote
    :model-value="isPastDueVisible"
    hide-close
  >
    <div class="flex justify-between items-center gap-2 w-full">
      <h2 class="text-sm text-black">
        <div>{{ t("Renew your overdue subscription to keep talking to thals.") }}</div>
      </h2>

      <form action="/api/payment/stripe/create-portal-session" method="POST">
        <Button size="xs" class="bg-yellow-500 rounded-full">
          <span class="flex text-black items-center justify-center gap-1">
            <Icon name="material-symbols:subscriptions-outline" />
            <span class="whitespace-nowrap">{{ t("Renew Thal") }}</span>
          </span>
        </Button>
      </form>
    </div>
  </AppNote>
</template>
