<script setup lang="ts">
// TODO: implement this
// const route = useRoute()
// const characterUsername = computed(() => route.query['build-character'] as string | undefined)
// console.log('build-character', characterUsername.value)

const sidebar = useSidebar()
</script>

<template>
  <CharacterBuilder
    @back="sidebar.back()"
  />
</template>
