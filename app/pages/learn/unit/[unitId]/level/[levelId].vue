<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    unitId: {{ route.params.unitId }}
    levelId: {{ route.params.levelId }}
  </div>
</template>
