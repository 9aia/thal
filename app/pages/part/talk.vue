<script setup lang="ts">
function onNewResult(a: any) {
  console.log('new result', a)
}
</script>

<template>
  <div class="px-4 py-4">
    <PronounceableText text="I'm trying" @result="onNewResult" />
  </div>
</template>
