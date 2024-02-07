<script setup lang="ts">
import Icon from "#design/components/display/Icon.vue";
import { useData } from "#framework/composables/useData";
import { t } from "#framework/i18n";
import { ref } from "vue";
import InterestModal from "../modals/InterestModal.vue";
import Data from "./+data";
import { Interest } from "../types";
import { parseInterests } from "../utils";

const profile = useData<typeof Data>();

const interestModal = ref<InstanceType<typeof InterestModal>>();
const interests = ref<Interest[]>(parseInterests(profile.value.interests || ""));
</script>

<template>
  <section class="pt-4">
    <label class="cursor-pointer">
      <h2 class="text-2xl mb-4 font-bold flex items-center gap-2">
        {{ t("Interests and hobbies") }}

        <button
          type="button"
          @click="interestModal?.open()"
          :aria-label="t('Edit interests')"
          :title="t('Edit interests')"
          class="text-black flex items-center"
        >
          <Icon>edit</Icon>
        </button>
      </h2>

      <div class="flex flex-wrap gap-2">
        <div v-for="interest in interests" class="badge p-4 gap-2">
          <Icon>{{ interest.icon }}</Icon>
          {{ t(interest.name) }}
        </div>

        <div v-if="!interests?.length">
          {{ t("No interest added.") }}
        </div>
      </div>
    </label>

    <InterestModal
      :selected="profile.interests || ''"
      ref="interestModal"
      v-model="interests"
    />
  </section>
</template>
