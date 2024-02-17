<script setup lang="ts">
import AboutMe from "./AboutMe.vue";
import Interests from "./Interests.vue";
import Summary from "./Summary.vue";
import Header from "./Header.vue";
import { useData } from "#framework/composables/useData";
import Data from "../+data";
import { ref, provide, onMounted } from "vue";
import Goals from "./Goals.vue";
import Observation from "./Observation.vue";
import { Cookies } from "#framework/utils/cookies";
import Btn from "#design/components/action/Btn.vue";
import { t } from "#framework/i18n";

const data = useData<typeof Data>();
const profile = ref(data.value);
provide("profile", profile);

/* onMounted(() => {
  Cookies.set("username", profile.value.username, { path: "/" });
}); */
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
