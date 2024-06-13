<script setup lang="ts">
import { onMounted } from "vue"
import { t } from "@psitta/vue"

defineProps<{
  loading: boolean
}>()

defineEmits<{
  (e: "nextLevel"): void
}>()

const confetti = useConfetti()

onMounted(() => {
  confetti.make()

  setTimeout(() => confetti.clear(), 5000)
})

onUnmounted(() => {
  confetti.clear()
})
</script>

<template>
  <div
    class="card max-w-lg mx-auto bg-neutral text-neutral-content absolute right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2"
  >
    <div class="card-body items-center text-center">
      <h2 class="card-title text-success mb-2 text-4xl font-bold">
        {{ t('You have finally the level!') }}
      </h2>

      <p>{{ t('You\'ve successfully completed the level.') }}</p>

      <div class="card-actions justify-between w-full mt-4">
        <A href="/explore" class="btn btn-sm btn-outline btn-primary">
          {{ t('Home') }}
        </A>

        <div class="flex gap-2">
          <!-- <Btn>
            Review
          </Btn> -->

          <Btn class="btn-warning" :loading="loading" @click="$emit('nextLevel')">
            {{ t('Next level') }}
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>
