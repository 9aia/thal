<script setup lang="ts">
import Breadcrumbs from "#design/components/navigation/Breadcrumbs.vue";
import ParentLayout from "../../+Layout.vue";
import { useBreadcrumbs } from "../store";
import { SETTINGS } from "../constants";
import { flattenObject } from "../utils";
import { t } from "#framework/i18n";
import { BreadcrumbItem } from "#design/components/navigation/types";
import Btn from "#design/components/action/Btn.vue";
import Icon from "#design/components/display/Icon.vue";
import { useData } from "#framework/composables/useData";
import Data from "./+data";
import { Transition, provide, ref } from "vue";

const data = useData<typeof Data>();
const profile = ref(data.value);
provide("profile", profile);

const root: BreadcrumbItem = {
  id: "settings",
  name: t("Settings"),
  icon: "settings",
  href: "/app/settings",
};
const { items, path, back } = useBreadcrumbs({
  urlPathname: "/app/settings",
  config: flattenObject(SETTINGS),
  root,
});
</script>

<template>
  <ParentLayout>
    <div class="max-w-lg mx-auto py-2">
      <Breadcrumbs v-if="path.length" :items="items" class="mb-4" />

      <slot />

      <hr class="border-gray-400 mt-12" />

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
