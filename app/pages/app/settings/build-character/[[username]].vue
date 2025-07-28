<script setup lang="ts">
definePageMeta({
  layout: 'settings',
  middleware: 'auth',
  pageTransitionType: 'slide',
})

useAutoRedirect()

const router = useRouter()
const route = useRoute()

const characterUsername = computed(() => route.params.username as string)
</script>

<template>
  <CharacterBuilder
    :character-username="characterUsername"
    @back="router.back()"
  />
</template>
