<script setup lang="ts">
defineProps<{
  messageAnalysis: string
  messageAnalysisCompressed: string
}>()

const isModalOpen = ref(false)

function closeAnalysis() {
  console.log('close analysis')
}
</script>

<template>
  <div
    class="bg-radial-[at_bottom] from-red-50 to-gray-50 text-red-900 rounded-2xl px-3 py-2 min-h-[38px] flex items-start justify-between gap-2 group/translation"
    @click="isModalOpen = true"
  >
    <article class="text-red-500 text-sm">
      {{ messageAnalysisCompressed }}
    </article>

    <div class="items-start min-w-[32px] min-h-[32px] flex">
      <Button
        class="btn btn-circle btn-sm btn-ghost btn-neutral hidden group-hover/translation:flex"
        icon="material-symbols:close-rounded"
        icon-class="text-xl"
        @click.stop="closeAnalysis()"
      />
    </div>
  </div>

  <!-- <LazyMessageAnalysisModal
    v-model="isModalOpen"
    :message-analysis="messageAnalysis"
  /> -->
</template>
