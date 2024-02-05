<script setup lang="ts">
import { useData } from "#framework/composables/useData";
import { ITEMS } from "../utils";
import Data from "./+data";
import Icon from "#design/components/display/Icon.vue";
import { t } from "#framework/i18n";

const profile = useData<typeof Data>();
</script>

<template>
  <section>
    <h2 class="text-4xl mb-4 font-bold">{{ t("About me") }}</h2>

    <div class="space-y-2">
      <label v-for="item in ITEMS" class="flex items-center gap-2">
        <Icon>{{ item.icon }}</Icon>
        <span>{{ item.label }} {{ profile[item.id] }}</span>
      </label>
    </div>
  </section>
</template>
