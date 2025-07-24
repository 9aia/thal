<script setup lang="ts">
const { t } = useI18nExperimental()
const releaseType = useReleaseType()

const isReleaseModalOpen = ref(false)

const cookie = useCookie('thal_release_modal_closed')

const icon = computed(() => {
  if (releaseType.value === 'dev') {
    return 'material-symbols:code-rounded'
  }

  if (releaseType.value === 'preview') {
    return 'material-symbols:visibility-outline-rounded'
  }

  if (releaseType.value === 'early-access') {
    return 'material-symbols:rocket-outline-rounded'
  }

  if (releaseType.value === 'early-stable') {
    return 'material-symbols:rocket-launch-outline-rounded'
  }

  return 'material-symbols:info-outline'
})
</script>

<template>
  <template v-if="!cookie">
    <div
      class="bg-white w-full flex items-center justify-between gap-2 px-4 pb-2 group cursor-pointer focus:outline-none border-y-2 border-transparent group-focus:border-b-blue-500"
      role="button"
      tabindex="0"
      @click="isReleaseModalOpen = true"
    >
      <div class="flex items-center gap-2">
        <Icon :name="icon" class="text-gray-500" />

        <div
          class="flex gap-1 items-center justify-center text-xs text-gray-500"
        >
          <template v-if="releaseType === 'dev'">
            {{ t('Development: Testing upcoming features. Expect frequent changes, bugs, and data resets.') }}
          </template>
          <template v-if="releaseType === 'preview'">
            {{ t('Preview: Testing upcoming features. Expect frequent changes, bugs, and data resets.') }}
          </template>
          <template v-if="releaseType === 'early-access'">
            {{ t('Early Access: Core functionality implemented, more updates soon.') }}
          </template>
          <template v-if="releaseType === 'early-stable'">
            {{ t('Early Stable: Core functionality is set; updates will be critical patches.') }}
          </template>

          <span
            class="text-primary group-hover:underline text-nowrap"
          >
            {{ t('Learn more') }}
          </span>
        </div>
      </div>

      <Button
        class="btn btn-ghost btn-sm btn-circle"
        :aria-label="t('Close')"
        icon="material-symbols:close-rounded"
        icon-class="text-xl"
        @click.stop="cookie = 'true'"
      />
    </div>

    <LazyReleaseModal v-model="isReleaseModalOpen" />
  </template>
</template>
