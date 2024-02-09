<script setup lang="ts">
import { useData } from "#framework/composables/useData";
import { t } from "#framework/i18n";
import { computed, provide, ref } from "vue";
import Data from "../+data";
import HobbyModal from "../../modals/HobbyModal.vue";
import ProfessionModal from "../../modals/ProfessionModal.vue";
import { parseJoin } from "../../utils";
import Icon from "#design/components/display/Icon.vue";
import { GOALS, HOBBIES } from "../../constants";
import Btn from "#design/components/action/Btn.vue";
import GoalsModal from "../../modals/GoalsModal.vue";

const data = useData<typeof Data>();
const profile = ref(data.value);
provide("profile", profile);

const isHobbyModalOpen = ref(false);
const isProfessionModalOpen = ref(false);
const isGoalsModalOpen = ref(false);

const hobbies = computed(() => {
  return parseJoin<any>(profile.value.hobbies || "", HOBBIES);
});
const goals = computed(() => {
  return parseJoin<any>(profile.value.goals || "", GOALS);
});
</script>

<template>
  <div class="max-w-lg mx-auto py-4">
    <h1 class="text-4xl font-bold mb-4">{{ t("Your profile") }}</h1>

    <div class="divide-y divide-black space-y-4">
      <section>
        <h2 class="text-2xl mb-4 mt-4 font-bold flex items-center gap-2">
          {{ t("Goals") }}
        </h2>

        <p class="mb-4">
          {{
            t(
              "What are your learning goals? Are they aiming for basic conversation, business English, reading comprehension, writing skills, or something else?"
            )
          }}
        </p>

        <div class="flex flex-wrap gap-2 items-center">
          <div v-for="goal in goals" class="badge p-4 gap-2">
            <Icon>{{ goal.icon }}</Icon>
            {{ t(goal.name) }}
          </div>

          <div v-if="!goals?.length">
            {{ t("No goals added.") }}
          </div>

          <Btn
            @click="isGoalsModalOpen = true"
            class="text-black flex items-center"
          >
            <template v-if="!goals?.length">
              <Icon>add</Icon>
              {{ t("Add goals") }}
            </template>
            <template v-else>
              <Icon>edit</Icon>
              {{ t("Edit goals") }}
            </template>
          </Btn>

          <GoalsModal v-model="isGoalsModalOpen" />
        </div>
      </section>

      <section>
        <h2 class="text-2xl mb-4 mt-4 font-bold flex items-center gap-2">
          {{ t("Interests") }}
        </h2>

        <p class="mb-4">
          {{ t('What are your hobbies, interests, and profession? This helps personalize content and examples to make learning more engaging.') }}
        </p>

        <div class="flex flex-wrap gap-2 items-center">
          <div v-for="hobby in hobbies" class="badge p-4 gap-2">
            <Icon>{{ hobby.icon }}</Icon>
            {{ t(hobby.name) }}
          </div>

          <div v-if="!goals?.length">
            {{ t("No hobbies added.") }}
          </div>

          <Btn
            @click="isHobbyModalOpen = true"
            class="text-black flex items-center"
          >
            <template v-if="!goals?.length">
              <Icon>add</Icon>
              {{ t("Add hobbies") }}
            </template>
            <template v-else>
              <Icon>edit</Icon>
              {{ t("Edit hobbies") }}
            </template>
          </Btn>

          <HobbyModal v-model="isHobbyModalOpen" />
        </div>

        <div class="flex gap-2 flex-wrap items-center mt-4">
          <div v-if="profile.profession">
            <div class="flex items-center gap-2">
              <Icon>work</Icon>
              <div>
                <span class="font-bold">My profession</span>:
                <span>{{ profile.profession }}</span>
              </div>
            </div>
          </div>

          <Btn
            @click="isProfessionModalOpen = true"
            class="text-black flex items-center"
          >
            <template v-if="!profile.profession">
              <Icon>add</Icon>
              {{ t("Add profession") }}
            </template>

            <template v-else>
              <Icon>edit</Icon>
              {{ t("Edit profession") }}
            </template>
          </Btn>

          <ProfessionModal v-model="isProfessionModalOpen" />
        </div>
      </section>
    </div>
  </div>
</template>
