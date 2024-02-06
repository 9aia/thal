<script setup lang="ts">
import { useData } from "#framework/composables/useData";
import { t } from "#framework/i18n";
import { computed } from "vue";
import Data from "./+data";
import Avatar from "#design/components/display/Avatar.vue";

const profile = useData<typeof Data>();

const signupDate = computed(() => {
  return profile.value.signupDate;
});
console.log(signupDate.value)
</script>

<template>
  <div class="shadow-lg bg-base-100 p-4 rounded-lg flex gap-4 items-center">
    <Avatar :name="profile.name" class="w-24 text-3xl" />

    <div>
      <h2 class="text-lg font-bold">{{ profile.name }}</h2>
      <div class="text-sm">{{ profile.username }}</div>

      <small class="text-gray-600">
        {{
          t("Joined {signupDate}", {
            signupDate: { date: new Date(signupDate), year: "numeric", month: "long" },
          })
        }}
      </small>
    </div>
  </div>
</template>
