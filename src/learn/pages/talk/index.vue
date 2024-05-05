<script setup lang="ts">
definePageMeta({
  middleware: 'premium',
  layout: 'app',
})

const onNewResult = (a: any) => {
  console.log('new result', a)
}
</script>

<template>
  <div class="px-4 py-4">
    <PronounceableText @result="onNewResult" text="I'm trying" />
  </div>
</template>
