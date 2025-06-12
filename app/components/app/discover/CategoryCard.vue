<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { scrollIntoView } from '~/utils/web'
import type Button from '~/components/ui/action/Button.vue'

const props = defineProps<{
  name: string
  description: string
  icon: string
  color: string
  isSelected: boolean
}>()

const button = useTemplateRef<ComponentPublicInstance<typeof Button>>('button')

watchEffect(() => {
  if (props.isSelected)
    scrollIntoView(button.value?.buttonElement)
})

useEventListener(toRef(() => button.value?.buttonElement), 'focusin', (event) => {
  const target = event.target as HTMLElement
  scrollIntoView(target)
})
</script>

<template>
  <Button
    ref="button"
    class="btn btn-neutral btn-xs !px-3 !py-4 w-max"
    :class="[{
      'outline-2 outline-offset-2 outline-primary': isSelected,
    }]"
    :icon="icon"
    :icon-class="`text-xl ${color}`"
  >
    {{ name }}
  </Button>
</template>
