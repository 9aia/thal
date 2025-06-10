<script setup lang="ts">
const { t } = useI18nExperimental()
</script>

<template>
  <div
    class="px-6 py-2 mx-auto max-w-lg flex items-center justify-center gap-1 bg-radial-[at_bottom] from-orange-50 to-gray-50 rounded-2xl"
  >
    <Icon
      name="material-symbols:science-outline"
      class="text-black text-lg"
    />

    <p class="text-black text-xs">
      {{ t('This character uses AI to simulate interactions. Please use responsibly.') }}
    </p>
  </div>
</template>
