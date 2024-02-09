<script setup lang="ts">
import Icon from "#design/components/display/Icon.vue";
import { t } from "#framework/i18n";
import { Ref, computed, inject } from "vue";
import { GOALS } from "../../constants";
import { Profile } from "../../schemas/profile";
import { parseJoin } from "../../utils";

const profile = inject<Ref<Profile>>("profile")!;
const goals = computed(() => {
  return parseJoin(profile.value.goals || "", GOALS);
});
</script>

<template>
  <section class="pt-4">
    <label class="cursor-pointer">
      <h2 class="text-2xl mb-4 font-bold flex items-center gap-2">
        {{ t("Goals") }}
      </h2>

      <div class="flex flex-wrap gap-2">
        <div v-for="goal in goals" class="badge p-4 gap-2">
          <Icon>{{ goal.icon }}</Icon>
          {{ t(goal.name) }}
        </div>

        <div v-if="!goals?.length">
          {{ t("No goals added.") }}
        </div>
      </div>
    </label>
  </section>
</template>
