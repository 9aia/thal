<script setup lang="ts">
import { t } from '@psitta/vue'
import Icon from '../../icon/Icon.vue'
import type { BreadcrumbItem } from './types'
import { A } from '#components'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <div class="text-sm breadcrumbs text-gray-600">
    <ul>
      <li v-for="(item, i) in items" :key="item.id">
        <component
          :is="i < items.length - 1 ? A : 'span'"
          :href="item.href"
          class="inline-flex gap-2 items-center !no-underline"
          :class="{ 'text-primary': i === items.length - 1 }"
        >
          <Icon v-if="item.icon">
            {{ item.icon }}
          </Icon>
          {{ item.name ? t(item.name as any) : "Item" }}
        </component>
      </li>
    </ul>
  </div>
</template>
