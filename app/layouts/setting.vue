<script setup lang="ts">
import { t } from "@psitta/vue"
import { SETTINGS } from "~/constants/settings"
import AppLayout from "~/layouts/app.vue"
import type { BreadcrumbItem } from "~~/layers/ui/components/navigation/types"
import useBreadcrumbs from "~~/layers/ui/composables/useBreadcrumbs"

const root: BreadcrumbItem = {
  id: "settings",
  name: t("Settings"),
  icon: "settings",
  href: "/app/settings",
}
const { items, path, back } = useBreadcrumbs({
  path: "/app/settings",
  config: flattenObject(SETTINGS),
  root,
})
</script>

<template>
  <AppLayout class="bg-slate-300" :hide-header="true">
    <div class="px-4 py-4 overflow-auto max-h-full">
      <Breadcrumbs v-if="path.length" :items="items" class="mb-2" />

      <slot />

      <hr v-if="path.length" class="border-base-200 mt-12">

      <Btn
        v-if="path.length"
        :items="items"
        class="mt-4 flex items-center"
        @click="back"
      >
        <Icon>west</Icon>
        {{ t("Back") }}
      </Btn>
    </div>
  </AppLayout>
</template>
