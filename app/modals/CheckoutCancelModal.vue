<script setup lang="ts">
import Link from '~/components/ui/navigation/Link.vue'

const { t } = useI18nExperimental()

const isOpen = defineModel({ default: false })
</script>

<template>
  <Modal
    v-model="isOpen"
    hide-confirm
    show-close-button :title="t('Checkout Canceled')"
    no-scroll
  >
    <p class="px-8 text-base text-black mb-4">
      {{ t('Looks like you didn’t finish the payment. That’s totally fine — no charges were made. If there’s something that held you back, we’d love to hear your thoughts.') }}
    </p>

    <div class="flex items-center h-fit gap-2 px-8">
      <Link
        class="btn btn-sm btn-warning"
        span-class="group-hover:no-underline"
        href="https://forms.gle/UyGBzPrBeNfFgwLD6"
        :localize="false"
      >
        {{ t("Send feedback") }}
      </Link>

      <Link
        class="btn btn-sm btn-primary btn-soft"
        span-class="group-hover:no-underline"
        href="/"
        :localize="false"
      >
        {{ t("Access home page") }}
      </Link>
    </div>
  </Modal>
</template>
