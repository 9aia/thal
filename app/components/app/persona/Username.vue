<script setup lang="ts">
import { useI18n } from "@psitta/vue"

const props = defineProps<{
  username: string
  showCopy?: boolean
}>()

const { t } = useI18n()
const toast = useToast()

async function copy() {
  try {
    await navigator.clipboard.writeText(props.username)

    toast.success(t("Username copied to clipboard"))
  }
  catch (_e) {
    const _ = _e
    toast.error(t("Failed to copy username to clipboard"))
  }
}
</script>

<template>
  <div class="text-slate-600 flex gap-1 font-normal">
    @{{ username }}

    <button
      v-if="showCopy && username"
      size="sm"
      class="text-teal-500 hover:text-teal-600 flex items-center"
      @click.stop.prevent="copy"
    >
      <Icon name="content_copy" style="font-size: 1.15rem" />
    </button>
  </div>
</template>
