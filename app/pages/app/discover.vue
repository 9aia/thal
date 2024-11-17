<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import AppLayout from "~/layouts/app.vue"
import { isRootDrawerOpen } from "~/store"
import { categories } from "~/constants/discover"
import queryKeys from "~/queryKeys"

const {
  t,
} = useI18n()

definePageMeta({
  layout: false,
  middleware: "premium",
})

const {
  data,
  isError,
  isPending,
  refetch,
} = await useServerQuery("/api/persona/discover", {
  queryKey: queryKeys.discoverPersonas,
})
</script>

<template>
  <AppLayout>
    <template #side>
      <Home />
    </template>

    <template #content>
      <Navbar class="px-3 py-2 bg-slate-800 flex gap-2 h-[64px]">
        <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
          <Btn size="sm" class="btn-ghost lg:hidden btn-circle" @click="isRootDrawerOpen = true">
            <Icon name="arrow_back" />
          </Btn>
          {{ t("Characters") }}
        </h1>
      </Navbar>

      <main
        :tabindex="0"
        class="flex-1 flex items-start overflow-y-auto focus:outline-none overflow-x-hidden"
      >
        <div class="mx-auto pb-4">
          <div class="px-4 pt-4 mb-4">
            <TextField :placeholder="t('Search for characters')" path="search" icon-position="right">
              <template #icon>
                <Icon name="search" />
              </template>
            </TextField>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between px-4">
              <h2 class="text-slate-800 text-sm font-bold">
                {{ t("Categories") }}
              </h2>
              <button class="text-teal-500 text-xs font-bold float-right">
                {{ t("View all") }}
              </button>
            </div>

            <div v-drag-scroller class="flex gap-2 px-4 overflow-x-hidden w-screen sm:w-[500px] lg:w-[600px] cursor-grab">
              <CategoryCard
                v-for="category, index in categories"
                :key="`category-${index}`"
                :name="t(category.name)"
                :description="t(category.description)"
                :icon="category.icon"
                :color="category.color"
              />
            </div>
          </div>

          <div class="space-y-2">
            <h2 class="text-slate-800 font-bold px-4 text-sm">
              {{ t("Characters") }}
            </h2>

            <div class="pl-2 pr-4 pb-2 space-y-1 overflow-y-auto mt-4">
              <Resource
                :error="isError"
                :loading="isPending"
                @execute="refetch"
              >
                <DiscoverCharacterItem
                  v-for="character in data"
                  :key="`persona-${character.id}`"
                  :name="character.name"
                  :description="character.description"
                  :username="character.personaUsernames?.username"
                  show-copy
                  show-send-message
                />
              </resource>
            </div>
          </div>
        </div>
      </main>
    </template>
  </AppLayout>
</template>
