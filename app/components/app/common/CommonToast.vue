<script setup lang="ts">
import { t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

const toast = useToast()
</script>

<template>
  <Toast>
    <template #actions>
      <Link
        v-if="toast.type.value === 'error'"
        class="btn btn-xs btn-neutral"
        span-class="group-hover:no-underline"
        href="https://forms.gle/UyGBzPrBeNfFgwLD6"
        :localize="false"
      >
        {{ t("Report issue") }}
      </Link>
    </template>
  </Toast>
</template>
