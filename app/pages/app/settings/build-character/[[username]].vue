<script setup lang="ts">
definePageMeta({
  layout: 'settings',
  middleware: 'auth',
  pageTransitionType: 'slide',
})

useAutoRedirect()

const router = useRouter()
const route = useRoute()
const characterId = computed(() => route.params.username as string)
</script>

<template>
  <CharacterBuilder
    :character-id="characterId"
    @back="router.back()"
  />
</template>
