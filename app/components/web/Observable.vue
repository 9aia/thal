<script setup lang="ts">
const props = withDefaults(defineProps<{
  isConnected: boolean
}>(), {
  isConnected: true,
})

const emit = defineEmits<{
  (e: 'intersect'): void
}>()

const endMarkerRef = ref<HTMLDivElement>()

const observer = ref<IntersectionObserver>()

onMounted(() => {
  observer.value = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting)
        emit('intersect')
    },
    { threshold: 1.00 },
  )

  if (!endMarkerRef.value)
    return

  observer.value.observe(endMarkerRef.value)
})

onUnmounted(() => {
  if (observer.value && endMarkerRef.value)
    observer.value.unobserve(endMarkerRef.value)
})

watch(() => props.isConnected, (isConnected) => {
  if (!endMarkerRef.value)
    return

  if (isConnected)
    observer.value?.observe(endMarkerRef.value)
  else
    observer.value?.unobserve(endMarkerRef.value)
}, { immediate: true })
</script>

<template>
  <div ref="endMarkerRef" />
</template>
