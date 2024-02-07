<script setup lang="ts">
import Btn from "#design/components/action/Btn.vue";
import Icon from "#design/components/display/Icon.vue";
import { useToast } from "#design/composables/useToast";
import client from "#framework/client";
import { useData } from "#framework/composables/useData";
import { onMounted, ref } from "vue";
import Data from "./+data";
import { t } from "#framework/i18n";
import Skeleton from "#design/components/feedback/Skeleton.vue";

const toast = useToast();
const profile = useData<typeof Data>();
const loading = ref(true);
const summary = ref("");

const generateSummary = async () => {
  const profileData: any = { ...profile.value };
  delete profileData.name;
  delete profileData.lastName;

  const res = await client.app.summary.$post({
    json: profileData,
  });

  if (!res.ok) {
    throw new Error("An error occurred while fetching your profile data.");
  }

  const data = await res.json();

  return data.summary;
};

const regenerateSummary = async () => {
  loading.value = true;

  try {
    summary.value = await generateSummary();
  } catch (e) {
    toast.error(t("An error occurred while generating the summary."));
  }

  loading.value = false;
};

onMounted(async () => {
  regenerateSummary();
});
</script>

<template>
  <section>
    <h2 class="text-2xl mb-4 font-bold mt-4">{{ t("Summary") }}</h2>

    <div>
      <template v-if="loading">
        <Skeleton class="w-full h-32" />
      </template>
      <template v-else>
        <p class="text-md text-gray-900">{{ summary }}</p>
      </template>
    </div>

    <Btn class="mt-2" @click="regenerateSummary()" :loading="loading">
      <Icon>redo</Icon>
    </Btn>
  </section>
</template>
