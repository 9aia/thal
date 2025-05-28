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
      <ChatList />
    </template>

    <template #content>
      <Navbar hide-title hide-back class="px-3 py-2 bg-gray-800 flex gap-2 h-[64px]">
        <h1 class="text-lg py-2 text-blue-500 flex items-center gap-1">
          <Button size="sm" class="btn-ghost lg:hidden" shape="circle" @click="isRootDrawerOpen = true">
            <Icon name="material-symbols:arrow-back" />
          </Button>

          {{ t("Characters") }}
        </h1>
      </Navbar>

      <DiscoverBody />
    </template>
  </AppLayout>
</template>
