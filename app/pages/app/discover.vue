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
    <template #side>
      <ChatListDrawer />
    </template>

    <template #content>
      <Navbar
        class="px-3 py-2 bg-gray-800 flex gap-2 h-[64px]"
        :title="t('Characters')"
        hide-back="on-lg"
        @close="isRootDrawerOpen = true"
      />

      <DiscoverBody />
    </template>
  </AppLayout>
</template>
