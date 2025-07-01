<script setup lang="ts">
import { t } from '@psitta/vue'
</script>

<template>
  <AppNote
    hide-close
  >
    <div class="px-4 flex justify-between items-center gap-3 w-full">
      <h2 class="text-xs text-warning">
        <div>{{ t("Renew your overdue subscription to keep talking to thals.") }}</div>
      </h2>

      <form action="/api/payment/stripe/create-portal-session" method="POST">
        <Button
          class="btn btn-xs btn-warning w-max"
          icon="material-symbols:north-west-rounded"
          icon-class="text-base rotate-90"
          icon-position="right"
        >
          {{ t("Renew Thal") }}
        </Button>
      </form>
    </div>
  </AppNote>
</template>
