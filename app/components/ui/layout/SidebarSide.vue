<script setup lang="ts">
const props = defineProps<{
  components: Record<string, Component>
}>()

const SIDEBAR_LOADING_TO_COMPONENT_ANIMATION_NAME = 'fade-in-out-fast'

const sidebar = useSidebar()

const component = computed(() => props.components[sidebar.view.value])
const isLoading = ref(true)

watch(sidebar.state, (newState) => {
  sidebar.updateAutoRedirect(newState)
}, { immediate: true })

watch(sidebar.open, (open) => {
  if (open)
    return
  sidebar.updateAutoRedirect()
})
</script>

<template>
  <Transition
    :css="sidebar.animate.value"
    :name="isLoading
      ? SIDEBAR_LOADING_TO_COMPONENT_ANIMATION_NAME
      : sidebar.navigationDirection.value === 'forward' ? 'slide-tl' : 'slide-tr'"
  >
    <!-- TODO: add view not found handling -->
    <Suspense
      timeout="0"
      @fallback="isLoading = true"
      @pending="isLoading = false"
      @resolve="isLoading = false"
    >
      <component
        :is="component"
        v-if="sidebar.view.value"
      />

      <template #fallback>
        <Transition
          :css="sidebar.animate.value"
          :name="sidebar.navigationDirection.value === 'forward' ? 'slide-tl' : 'slide-tr'"
        >
          <slot name="loading" />
        </Transition>
      </template>
    </Suspense>
  </Transition>
</template>

<style scoped>
@reference '~/assets/css/main.css';
</style>
