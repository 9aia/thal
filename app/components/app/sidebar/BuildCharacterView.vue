<script setup lang="ts">
const route = useRoute()

const characterUsername = computed(() => route.query['build-character'] as string | undefined)

console.log('build-character', characterUsername.value)
</script>

<template>
  <CharacterBuilder
    :character-username="characterUsername"
    opener="sidebar"
  />
</template>
