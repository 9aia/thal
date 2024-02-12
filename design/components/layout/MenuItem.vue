<script setup lang="ts">
import { t } from "#framework/i18n";
import Icon from "../display/Icon.vue";
import ChevronRight from "./ChevronRight.vue";
import { MenuItem } from "./types";

defineProps<{
  is: MenuItem;
}>();
</script>

<template>
  <div
    class="flex justify-between items-center gap-2"
    :class="{
      'text-warning font-bold': is.meaning === 'warning',
      'text-danger font-bold': is.meaning === 'danger',
    }"
  >
    <Icon v-if="is.icon">{{ is.icon }}</Icon>
    {{ t(is.name as any) }}
  </div>
  <Icon v-if="is.type === 'external'">north_east</Icon>
  <ChevronRight v-if="is.type === 'accordion'" />
</template>
