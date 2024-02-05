<script setup lang="ts">
import Avatar from "#design/components/display/Avatar.vue";
import Logo from "#design/components/display/Logo.vue";
import NavbarMenu from "#design/components/layout/NavbarMenu.vue";
import { NavbarMenuItem } from "#design/components/layout/types";
import { A } from "#framework/i18n";
import { ref } from "vue";

const items: NavbarMenuItem[] = [
  { id: "profile", name: "Profile", icon: "person", href: "/app/profile" },
  {
    id: "plan",
    name: "Plan",
    action: "/api/payment/stripe/create-portal-session",
    method: "POST",
    icon: "subscriptions",
    external: true,
  },
  {
    id: "logout",
    name: "Logout",
    action: "/api/auth/logout",
    method: "POST",
    icon: "logout",
  },
];
</script>

<template>
  <header class="">
    <div class="navbar bg-base-100">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl" href="/app">
          <Logo />
          Maratongue
        </a>
      </div>

      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <Avatar type="button" class="w-10" :button="true" />

          <NavbarMenu :items="items" />
        </div>
      </div>
    </div>
  </header>
  <main>
    <slot />
  </main>
</template>
