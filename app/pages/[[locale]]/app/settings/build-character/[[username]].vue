<script setup lang="ts">
import BuildCharacter from '~/components/app/character/CharacterBuilder.vue'

definePageMeta({
  layout: 'settings',
  middleware: 'premium',
})

useAutoRedirect()

const router = useRouter()
const route = useRoute()
const characterId = computed(() => route.params.username as string)
</script>

<template>
  <BuildCharacter
    :character-id="characterId"
    opener="router"
    @close="router.back()"
  />
</template>
