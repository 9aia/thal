<script setup lang="ts">
import { useData } from "#lib/vike/composables/useData";
import { t } from "#lib/i18n";
import { Cookies } from "#lib/web/utils/cookies";
import { provide, ref } from "vue";
import Data from "../+data";
import AboutMe from "./AboutMe.vue";
import Goals from "./Goals.vue";
import Header from "./Header.vue";
import Interests from "./Interests.vue";
import Observation from "./Observation.vue";
import Summary from "./Summary.vue";

const data = useData<typeof Data>();
const profile = ref(data.value);
provide("profile", profile);
</script>

<template>
  <div
    class="flex flex-col sm:flex-row"
    style="min-height: calc(100vh - 64px - 56px)"
  >
    <aside
      class="w-full md:w-1/2 lg:w-1/3 pt-4 pb-12 px-8 md:p-8 shadow-lg md:shadow-none"
    >
      <Header />
      <Summary />

      <a
        v-if="Cookies.get('username') === profile.username"
        href="/app/settings/profile"
        class="btn btn-sm mt-4"
        >{{ t("Edit profile") }}</a
      >
    </aside>

    <main
      class="w-full md:w-1/2 lg:w-2/3 p-8 space-y-6 divide-y divide-gray-400"
    >
      <AboutMe />
      <Goals />
      <Interests />
      <Observation />
    </main>
  </div>
</template>
