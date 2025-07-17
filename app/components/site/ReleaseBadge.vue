<script setup lang="ts">
const { t } = useI18nExperimental()

const showModal = ref(false)

const releaseType = useReleaseType()
</script>

<template>
  <template v-if="releaseType !== 'stable'">
    <button
      class="cursor-pointer rounded-full bg-radial-[at_bottom] from-magenta-50 to-gray-50 text-black text-xs uppercase focus:outline-secondary focus:outline-offset-2 focus:outline-2"
      @click="showModal = true"
    >
      <div class="px-2 py-1 block">
        <template v-if="releaseType === 'dev'">
          {{ t('Development') }}
        </template>
        <template v-if="releaseType === 'preview'">
          {{ t('Preview ::status::').replace('::status::', '') }}
        </template>
        <template v-if="releaseType === 'early-access'">
          {{ t('Early Access') }}
        </template>
        <template v-if="releaseType === 'early-stable'">
          {{ t('Early Stable') }}
        </template>
      </div>
    </button>

    <LazyReleaseModal v-model="showModal" />
  </template>
</template>
