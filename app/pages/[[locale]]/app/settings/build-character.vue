<script setup lang="ts">
import BuildCharacter from '~/components/app/sidebar/build-character.vue'

definePageMeta({
  layout: 'settings',
  middleware: 'premium',
})

useAutoRedirect()

const router = useRouter()
</script>

<template>
  <BuildCharacter
    opener="router"
    @close="router.back()"
  />
</template>
