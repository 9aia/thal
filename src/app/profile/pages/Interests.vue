<script setup lang="ts">
import Modal from "#design/components/action/Modal.vue";
import Icon from "#design/components/display/Icon.vue";
import { useData } from "#framework/composables/useData";
import { t } from "#framework/i18n";
import { ref } from "vue";
import { Interest } from "../types";
import { INTERESTS } from "../utils";
import Data from "./+data";

const profile = useData<typeof Data>();

const getInterests = () => {
  const array: any = profile.value.interests
    .split(", ")
    .map((interestId: string) => {
      return INTERESTS.find((interest) => interest.id === interestId) || {};
    });

  return array as Interest[];
};

const interests = ref(getInterests());

const modal = ref<InstanceType<typeof Modal>>();

const editInterests = () => {
  modal.value?.show();
};
</script>

<template>
  <section class="pt-4">
    <Modal ref="modal" :confirm-text="t('Save')">
      <h3 class="font-bold text-lg">Hello!</h3>
      <p class="py-4">Press ESC key or click the button below to close</p>
    </Modal>

    <h2 class="text-2xl mb-4 font-bold flex items-center gap-2">
      {{ t("Interests e hobbies") }}

      <button
        type="button"
        @click="editInterests"
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
        {{ interest.name }}
      </div>
    </div>
  </section>
</template>
