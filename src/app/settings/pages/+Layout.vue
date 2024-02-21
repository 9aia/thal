<script setup lang="ts">
import { provide, reactive } from 'vue'
import ParentLayout from '../../+Layout.vue'
import { SETTINGS } from '../constants'
import { flattenObject } from '../utils'
import type Data from './+data'
import Btn from '#lib/daisy/components/action/Btn.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import Breadcrumbs from '#lib/daisy/components/navigation/Breadcrumbs.vue'
import type { BreadcrumbItem } from '#lib/daisy/components/navigation/types'
import useBreadcrumbs from '#lib/daisy/composables/useBreadcrumbs'
import { useData } from '#lib/vike/composables/useData'
import { t } from '#lib/i18n'

const data = useData<typeof Data>()
const profile = reactive(data.value)
provide('profile', profile)

const root: BreadcrumbItem = {
  id: 'settings',
  name: t('Settings'),
  icon: 'settings',
  href: '/app/settings',
}
const { items, path, back } = useBreadcrumbs({
  urlPathname: '/app/settings',
  config: flattenObject(SETTINGS),
  root,
})
</script>

<template>
  <ParentLayout>
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
  </ParentLayout>
</template>
