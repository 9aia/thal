<script setup lang="ts">
import Avatar from "#design/components/display/Avatar.vue";
import ChevronRight from "#design/components/layout/ChevronRight.vue";
import MenuGroup from "#design/components/layout/MenuGroup.vue";
import type { MenuItem as MenuItemType } from "#design/components/layout/types";
import { t } from "#framework/i18n";

const settingItems: MenuItemType[] = [
  {
    id: "account",
    icon: "person",
    name: "Account",
    type: "accordion",
    href: "/app/settings/account",
  },
  {
    id: "plan",
    name: "Plan",
    action: "/api/payment/stripe/create-portal-session",
    method: "POST",
    icon: "subscriptions",
    type: "external",
  },
  {
    id: "privacy",
    icon: "disabled_visible",
    name: "Privacy",
    type: "accordion",
    href: "/app/settings/privacy",
  },
  {
    id: "notifications",
    icon: "notifications",
    name: "Notifications",
    type: "accordion",
    href: "/app/settings/notifications",
  },
  {
    id: "accessibility",
    icon: "accessibility",
    name: "Accessibility",
    type: "accordion",
    href: "/app/settings/accessibility",
  },
];

const supportItems: MenuItemType[] = [
  {
    id: "how_maratongue_works",
    icon: "directions_run",
    name: "How Maratongue works",
    href: "/how-maratongue-works",
  },
  {
    id: "feedback",
    icon: "feedback",
    name: "Give us feedback",
    type: "external",
    href: "https://forms.gle/5ePvXjrebyWGUrM26",
    newTab: true,
  },
  {
    id: "bug_report",
    icon: "bug_report",
    name: "Report a issue",
    type: "external",
    href: "https://forms.gle/ANMv7qnwTHva1k7L8",
    newTab: true,
  },
];

const legalItems: MenuItemType[] = [
  { id: "terms", icon: "gavel", name: "Terms of Service", href: "/terms" },
  { id: "privacy", icon: "policy", name: "Privacy policy", href: "/privacy" },
];

const personal = {
  name: "User",
  pronouns: "",
  username: "@user",
};
</script>

<template>
  <h1 class="text-4xl font-bold mb-4 ml-2">{{ t("Settings") }}</h1>

  <a
    href="/app/profile"
    class="group mb-4 shadow-lg bg-base-100 p-4 rounded-lg flex justify-between items-center"
  >
    <div class="flex gap-4 items-center">
      <Avatar :name="personal.name" class="w-16 text-md" />

      <label class="relative cursor-pointer flex flex-col gap-0">
        <h2 class="text-lg font-bold">{{ personal.name }}</h2>
        <small class="text-gray-600"> Show profile </small>
      </label>
    </div>

    <ChevronRight />
  </a>

  <div class="space-y-4">
    <section class="mb-2">
      <h2 class="font-bold text-2xl ml-2 mb-3">{{ t("General") }}</h2>
      <MenuGroup class="p-0 w-full shadow-none" :items="settingItems" />
    </section>

    <section class="pt-2">
      <h2 class="font-bold text-lg ml-2 mb-3">{{ t("Support") }}</h2>
      <MenuGroup :items="supportItems" />
    </section>

    <section class="pt-2">
      <h2 class="font-bold text-lg ml-2 mb-3">{{ t("Legal") }}</h2>
      <MenuGroup class="p-0 w-full shadow-none" :items="legalItems" />
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
