<script setup lang="ts">
import Avatar from "#design/components/display/Avatar.vue";
import Icon from "#design/components/display/Icon.vue";
import { t } from "#framework/i18n";
import { Ref, inject, ref } from "vue";
import PersonalModal from "../modals/PersonalModal.vue";
import { Profile } from "../schemas/profile";

const personal = inject<Ref<Profile>>("profile")!;
const personalModal = ref<InstanceType<typeof PersonalModal>>();
</script>

<template>
  <div class="shadow-lg bg-base-100 p-4 rounded-lg flex gap-4 items-center">
    <Avatar :name="personal.name" class="w-24 text-3xl" />

    <label class="relative cursor-pointer">
      <h2 class="text-lg font-bold">{{ personal.name }}</h2>
      <div class="text-sm flex gap-3">
        <div>@{{ personal.username }}</div>
        <div v-if="personal.pronouns">{{ personal.pronouns }}</div>
      </div>

      <button
        type="button"
        @click="personalModal?.open()"
        :aria-label="t('Edit personal data')"
        :title="t('Edit personal data')"
        class="text-black flex items-center absolute top-0 right-0"
      >
        <Icon>edit</Icon>
      </button>

      <small class="text-gray-600">
        {{
          t("Joined {signupDate}", {
            signupDate: {
              date: new Date(personal.signupDate),
              year: "numeric",
              month: "long",
            },
          })
        }}
      </small>
    </label>

    <PersonalModal ref="personalModal" />
  </div>
</template>
