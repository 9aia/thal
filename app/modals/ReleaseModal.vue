<script setup lang="ts">
import { isWhatsNewModalOpen } from '~/store'
import { version } from '~~/package.json'

const modelValue = defineModel<boolean>()
const { t } = useI18nExperimental()

const releaseType = useReleaseType()

const title = computed(() => {
  if (releaseType.value === 'dev') {
    return t('About development environment')
  }

  if (releaseType.value === 'preview') {
    return t('About preview')
  }

  if (releaseType.value === 'early-access') {
    return t('About early access')
  }

  if (releaseType.value === 'early-stable') {
    return t('About early stable')
  }

  return t('About Thal')
})

function openWhatsNewModal() {
  modelValue.value = false
  isWhatsNewModalOpen.value = true
}
</script>

<template>
  <Modal
    v-model="modelValue"
    show-close-button
    hide-confirm
    :title="title"
  >
    <template #default>
      <div class="px-8 space-y-4">
        <p class="text-sm text-gray-800">
          <template v-if="releaseType === 'preview' || releaseType === 'dev'">
            {{ t('This Thal version (v{version}) is running on an early, private and experimental environment built for testing and polishing upcoming features and improvements. Expect frequent changes, potential bugs, incomplete features, data resets and more.', { version }) }}
          </template>
          <template v-if="releaseType === 'early-access'">
            {{ t('This Thal version (v{version}) is running on an early, public and growing environment. It includes core features, a fully operational payment integration and will be updated with new features and improvements. Your feedback will directly shape the future of Thal!', { version }) }}
          </template>
          <template v-if="releaseType === 'early-stable'">
            {{ t('This Thal version (v{version}) is running on an early, public and stable environment. It includes a foundation with the core features and a fully operational payment integration. Updates will primarily focus on critical patches to ensure reliability.', { version }) }}
          </template>
          <template v-if="releaseType === 'stable'">
            {{ t('This Thal version (v{version}) is running on a stable environment. It includes core features and fully operational payment.', { version }) }}
          </template>
        </p>

        <div class="flex items-center gap-2">
          <Button
            class="btn btn-neutral"
            icon="material-symbols:campaign-outline-rounded"
            @click="openWhatsNewModal()"
          >
            {{ t("What's New") }}
          </Button>

          <Button
            as="a"
            href="https://forms.gle/UyGBzPrBeNfFgwLD6"
            target="_blank"
            icon="material-symbols:feedback-outline-rounded"
            class="btn btn-neutral"
          >
            {{ t('Send feedback') }}
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
