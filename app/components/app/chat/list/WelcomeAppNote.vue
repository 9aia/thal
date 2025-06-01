<script setup lang="ts">
import { t } from '@psitta/vue'

const isNoteVisibleCookie = useCookie('isNoteVisible', {
  default: () => true,
})
const isNoteVisible = ref(isNoteVisibleCookie.value)

onMounted(() => {
  isNoteVisibleCookie.value = false
})
</script>

<template>
  <AppNote
    v-model="isNoteVisible"
    icon-name="material-symbols:waving-hand-outline"
  >
    <h2 class="text-lg text-gradient-2 w-fit">
      {{ t('Welcome!') }}
    </h2>
  </AppNote>
</template>

<style scoped>
.text-gradient-2 {
  background: linear-gradient(50deg, var(--color-red-500'), var(--color-orange-500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
