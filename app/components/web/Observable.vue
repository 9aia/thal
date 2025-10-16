<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'

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
const visible = ref(false)

const timer = useIntervalFn(() => {
  if (visible.value)
    emit('intersect')
}, 1000, { immediate: false })

function setupObserver() {
  observer.value = new IntersectionObserver(([entry]) => {
    visible.value = entry?.isIntersecting ?? false
  }, { threshold: 1.0 })
}

function observeEl() {
  if (!endMarkerRef.value || !observer.value)
    return

  observer.value.observe(endMarkerRef.value)
  timer.resume()
}

function unobserveEl() {
  if (!endMarkerRef.value || !observer.value)
    return

  observer.value?.disconnect()
  timer.pause()
}

onMounted(() => {
  setupObserver()
  observeEl()
})

onUnmounted(() => {
  unobserveEl()
})

watch(visible, (value) => {
  if (value)
    timer.resume()
  else timer.pause()
})

watch(() => props.isConnected, (isConnected) => {
  if (!endMarkerRef.value)
    return

  if (isConnected)
    observeEl()
  else
    unobserveEl()
}, { immediate: true })
</script>

<template>
  <div ref="endMarkerRef">
    <slot :visible="visible" />
  </div>
</template>
