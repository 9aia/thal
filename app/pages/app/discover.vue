<script setup lang="ts">
import { t } from '@psitta/vue'
import { isRootDrawerOpen } from '~/store'
import AppLayout from '~/layouts/app.vue'

definePageMeta({
  layout: false,
  middleware: 'premium',
})

useAutoRedirect()
</script>

<template>
  <AppLayout>
    <template #content>
      <Navbar
        :title="t('Characters')"
        hide-back="on-lg"
        @close="isRootDrawerOpen = true"
      />

      <DiscoverBody />
    </template>
  </AppLayout>
</template>
