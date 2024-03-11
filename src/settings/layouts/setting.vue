<script setup lang="ts">
import { t } from '~/lib/psitta/vue'
import AppLayout from '~/src/base/layouts/app.vue'
import { SETTINGS } from '../constants'
import { flattenObject } from '../utils'

const root: BreadcrumbItem = {
  id: 'settings',
  name: t('Settings'),
  icon: 'settings',
  href: '/settings',
}
const { items, path, back } = useBreadcrumbs({
  path: '/settings',
  config: flattenObject(SETTINGS),
  root,
})
</script>

<template>
  <AppLayout class="bg-slate-300" :hide-header="true">
    <div class="max-w-lg mx-auto py-2 px-4 py-4">
      <Breadcrumbs v-if="path.length" :items="items" class="mb-4" />

      <slot />

      <hr v-if="path.length" class="border-gray-400 mt-12">

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
