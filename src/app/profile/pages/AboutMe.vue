<script setup lang="ts">
import Icon from "#design/components/display/Icon.vue";
import { t } from "#framework/i18n";
import { Ref, inject, ref } from "vue";
import AboutModal from "../modals/AboutModal.vue";
import { ITEMS } from "../utils";
import { Profile } from "../schemas/profile";

const profile = inject<Ref<Profile>>("profile")!;
const isModalOpen = ref(false);
</script>

<template>
  <section>
    <label class="cursor-pointer">
      <h2 class="text-4xl mb-4 font-bold flex items-center gap-2">
        {{ t("About me") }}

        <button
          type="button"
          @click="isModalOpen = true"
          :aria-label="t('Edit about me')"
          :title="t('Edit about me')"
          class="text-black flex items-center"
        >
          <Icon>edit</Icon>
        </button>
      </h2>

      <div class="space-y-2">
        <div
          v-for="item in ITEMS"
          class="flex items-center gap-2"
          v-show="profile[item.id]"
        >
          <Icon>{{ item.icon }}</Icon>
          <span>{{ item.label }} {{ profile[item.id] }}</span>
        </div>
      </div>
    </label>

    <AboutModal v-model="isModalOpen" />
  </section>
</template>
