<script setup lang="ts">
import { useI18n } from '@psitta/vue'
import { isRootDrawerOpen } from '~/store'
import AppLayout from '~/layouts/app.vue'

definePageMeta({
  layout: false,
  middleware: 'premium',
})

const { t } = useI18n()
</script>

<template>
  <AppLayout>
    <template #side>
      <ChatList />
    </template>

    <template #content>
      <Navbar class="px-3 py-2 bg-gray-800 flex gap-2 h-[64px]">
        <h1 class="text-lg py-2 text-blue-500 flex items-center gap-1">
          <Button size="sm" class="btn-ghost lg:hidden btn-circle" @click="isRootDrawerOpen = true">
            <Icon name="arrow_back" />
          </Button>
          {{ t("Characters") }}
        </h1>
      </Navbar>

      <ClientOnly>
        <CharacterList />
      </ClientOnly>
    </template>
  </AppLayout>
</template>
