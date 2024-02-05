<script setup lang="ts">
import { t } from "#framework/i18n";
import Icon from "../display/Icon.vue";
import { NavbarMenuItem } from "./types";

defineProps<{
  is: NavbarMenuItem;
}>();
</script>

<template>
  <div class="flex justify-between items-center gap-2">
    <Icon v-if="is.icon">{{ is.icon }}</Icon>
    {{ t(is.name as any) }}
  </div>
  <Icon v-if="is.external">north_east</Icon>
</template>
