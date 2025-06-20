<script setup lang="ts">
import { t } from '@psitta/vue'

defineProps<{
  editing: boolean
}>()

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
    v-model="isPastDueVisible"
    hide-close
  >
    <div class="px-4 flex justify-between items-center gap-3 w-full">
      <h2 class="text-xs text-black">
        <template v-if="editing">
          {{ t("Renew your overdue subscription to edit characters.") }}
        </template>

        <template v-else>
          {{ t("Renew your overdue subscription to create new characters.") }}
        </template>
      </h2>

      <form action="/api/payment/stripe/create-portal-session" method="POST">
        <Button
          class="btn btn-xs btn-warning w-max"
        >
          {{ t("Renew Thal") }}
        </Button>
      </form>
    </div>
  </AppNote>
</template>
