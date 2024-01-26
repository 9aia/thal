<script setup lang="ts">
import Btn from "#design/components/action/Btn.vue";
import Icon from "#design/components/display/Icon.vue";
import { useToast } from "#design/composables/useToast";
import client from "#framework/client";
import { computed, onMounted, ref } from "vue";
import { Interest, Profile } from "../types";
import { EXAMPLE, INTERESTS, ITEMS } from "../utils";

const toast = useToast();
const loading = ref(true);

const profile = ref<Profile>(EXAMPLE);
const summary = ref("");

const avatarPlaceholder = computed(() => {
  return profile.value.name[0].toUpperCase();
});
const since = computed(() => {
  const formattedDate = profile.value.signupDate.toLocaleDateString("pt-BR");
  return formattedDate;
});
const interests = computed(() => {
  const array: any = profile.value.interests
    .split(", ")
    .map((interestId: string) => {
      return INTERESTS.find((interest) => interest.id === interestId) || {};
    });

  return array as Interest[];
});

const generateSummary = async () => {
  const profileData: any = { ...profile.value };
  delete profileData.name;
  delete profileData.lastName;

  const res = await client.profile.$post({
    json: profileData,
  });
  if (!res.ok) {
    throw new Error("Error fetching content");
  }

  const data = await res.json();

  return data.summary;
};

const regenerateSummary = async () => {
  loading.value = true;

  try {
    summary.value = await generateSummary();
  } catch (e) {
    toast.error("Ocorreu algum erro ao gerar o resumo.");
  }

  loading.value = false;
};

onMounted(async () => {
  regenerateSummary();
});
</script>

<template>
  <div
    class="flex flex-col sm:flex-row"
    style="min-height: calc(100vh - 64px - 56px)"
  >
    <aside
      class="sm:w-1/2 md:w-1/3 pt-4 pb-12 px-8 md:p-8 shadow-lg md:shadow-none"
    >
      <div class="shadow-lg bg-base-100 p-4 rounded-lg flex items-center gap-4">
        <div class="avatar placeholder">
          <div class="bg-neutral text-neutral-content rounded-full w-24">
            <span class="text-3xl">{{ avatarPlaceholder }}</span>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-bold">{{ profile.name }}</h2>
          <p class="text-gray-600">Aqui desde {{ since }}</p>
        </div>
      </div>

      <section class="mt-4">
        <h2 class="text-2xl mb-4 font-bold mt-4">Resumo</h2>

        <template v-if="loading">
          <div class="flex flex-col gap-2">
            <div
              v-for="i in [0, 1, 2, 3, 4, 5]"
              class="skeleton h-4 w-full"
            ></div>
          </div>
        </template>
        <template v-else>
          <p class="text-md text-gray-900">
            {{ summary }}
          </p>

          <Btn class="mt-2" @click="regenerateSummary()">
            <Icon>redo</Icon>
          </Btn>
        </template>
      </section>
    </aside>

    <main class="sm:w-1/2 md:w-2/3 p-8 space-y-6 divide-y divide-gray-500">
      <section class="">
        <h2 class="text-4xl mb-4 font-bold">Sobre mim</h2>

        <div class="space-y-2">
          <label v-for="item in ITEMS" class="flex items-center gap-2">
            <Icon>{{ item.icon }}</Icon>
            <span>{{ item.label }} {{ profile[item.id] }}</span>
          </label>
        </div>
      </section>

      <section class="pt-6">
        <h2 class="text-2xl mb-4 font-bold">Interesses e Hobbies</h2>

        <div class="flex flex-wrap gap-2">
          <div v-for="interest in interests" class="badge p-4 gap-2">
            <Icon>{{ interest.icon }}</Icon>
            {{ interest.name }}
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
