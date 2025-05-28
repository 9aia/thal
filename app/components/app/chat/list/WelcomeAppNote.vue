<script setup lang="ts">
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
  background: linear-gradient(50deg, theme('colors.red.500'), theme('colors.orange.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
