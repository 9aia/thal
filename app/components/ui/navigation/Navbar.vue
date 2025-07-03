<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  hideBack?: 'always' | 'on-lg' | 'never'
  hideTitle?: boolean
  backIcon?: string
  opener?: 'router' | 'sidebar' | 'main'
}>(), {
  opener: 'router',
})

const emit = defineEmits<({
  (e: 'close'): void
})>()

const sidebar = useSidebar()
const router = useRouter()

function handleGoBack() {
  if (props.opener === 'main') {
    emit('close')
    return
  }

  if (props.opener === 'router') {
    router.back()
  }
  else if (props.opener === 'sidebar') {
    sidebar.back()
  }
}
</script>

<template>
  <div
    class="bg-white px-6 pt-4 pb-0 h-[64px] min-h-[64px] flex gap-2 justify-between"
  >
    <h1 v-if="!hideTitle" class="text-sm py-2 text-black flex items-center justify-start gap-1 -translate-x-1.5">
      <Button
        v-if="hideBack !== 'never'"
        class="btn btn-neutral btn-md btn-ghost btn-circle"
        :class="{
          'lg:hidden': hideBack === 'on-lg',
        }"
        :icon="backIcon || 'material-symbols:arrow-back-rounded'"
        @click="handleGoBack()"
      />

      <slot name="title">
        {{ title }}
        <!-- TODO: remove below -->
        {{ opener }}
      </slot>
    </h1>

    <slot />
  </div>
</template>
