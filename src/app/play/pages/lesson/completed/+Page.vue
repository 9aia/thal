<script setup lang="ts">
import { onMounted } from 'vue'
import { useConfetti } from '#lib/daisy/composables/useConfetti'

const confetti = useConfetti()

onMounted(() => {
  confetti.make()

  setTimeout(() => confetti.clear(), 5000)
})
</script>

<template>
  <div class="max-w-lg mx-auto text-center">
    <div
      class="w-full flex flex-col p-4 absolute left-0 bottom-1/2 translate-y--1/2"
    >
      <h1 class="text-success mb-2 text-2xl font-bold">
        Mastered the Challenge!
      </h1>
      <p class="text-primary-content mb-4">
        You've successfully completed the English lesson.
      </p>
    </div>
  </div>

  <a
    href="/app/explore"
    class="btn btn-primary w-full"
    @click="confetti.clear()"
  >Continuar</a>
</template>
