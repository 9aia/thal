<script setup lang="ts">
import Avatar from "#design/components/display/Avatar.vue";
import ChevronRight from "#design/components/layout/ChevronRight.vue";
import MenuGroup from "#design/components/layout/MenuGroup.vue";
import { t } from "#framework/i18n";
import { Profile } from "~/app/profile/schemas/profile";
import { SETTINGS } from "../../constants";
import { inject } from "vue";

const profile = inject<Profile>("profile")!;
</script>

<template>
  <h1 class="text-4xl font-bold mb-4 ml-2">{{ t("Settings") }}</h1>

  <a
    href="/app/profile"
    class="group mb-4 shadow-lg bg-base-100 p-4 rounded-lg flex justify-between items-center transition duration-300 hover:shadow-2xl"
  >
    <div class="flex gap-4 items-center">
      <Avatar :name="profile.name" class="w-16 text-md" />

      <label class="relative cursor-pointer flex flex-col gap-0">
        <h2 class="text-lg font-bold">{{ profile.name }}</h2>
        <small class="text-gray-600">
          {{ t("Show profile") }}
        </small>
      </label>
    </div>

    <ChevronRight />
  </a>

  <div class="space-y-4">
    <section class="mb-2 pt-2">
      <h2 class="text-teal-900 font-bold text-2xl ml-2 mb-3">{{ t("General") }}</h2>
      <MenuGroup class="p-0 w-full shadow-none" :items="SETTINGS.general" />
    </section>

    <section class="pt-2">
      <h2 class="text-teal-900 font-bold text-lg ml-2 mb-3">{{ t("Support") }}</h2>
      <MenuGroup :items="SETTINGS.support" />
    </section>

    <section class="pt-2">
      <h2 class="text-teal-900 font-bold text-lg ml-2 mb-3">{{ t("Legal") }}</h2>
      <MenuGroup class="p-0 w-full shadow-none" :items="SETTINGS.legal" />
    </section>

    <section class="pt-2">
      <form action="/api/auth/logout" class="ml-2">
        <button class="underline font-bold text-warning">
          {{ t("Logout") }}
        </button>
      </form>
    </section>
  </div>
</template>
