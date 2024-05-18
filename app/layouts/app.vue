<script setup lang="ts">
import Avatar from "~~/layers/ui/components/display/Avatar.vue"
import Icon from "~~/layers/ui/components/display/Icon.vue"
import Menu from "~~/layers/ui/components/layout/Menu.vue"
import type { MenuItem } from "~~/layers/ui/components/layout/types"

withDefaults(
  defineProps<{
    hideHeader?: boolean
  }>(),
  { hideHeader: false },
)

const logout = useLogout()
const route = useRoute()

const items: MenuItem[] = [
  { id: "profile", name: "Profile", icon: "face", href: "/profile" },
  {
    id: "plan",
    name: "Plan",
    action: "/api/payment/stripe/create-portal-session",
    method: "post",
    icon: "subscriptions",
    type: "external",
  },
  { id: "settings", name: "Settings", icon: "settings", href: "/settings" },
  {
    id: "logout",
    name: "Logout",
    action: "/api/auth/logout",
    method: "post",
    icon: "logout",
    onSubmit: logout,
  },
]

interface BottomNavItem {
  id: string
  name?: string
  icon: string
  href: string
}

const navItems: BottomNavItem[] = [
  {
    id: "explore",
    name: "Explore",
    icon: "explore",
    href: "/explore",
  },
  { id: "missions", name: "Missions", icon: "editor_choice", href: "/missions" },
  { id: "rank", name: "Rank", icon: "trophy", href: "/rank" },
  { id: "profile", name: "Profile", icon: "face", href: "/profile" },
  { id: "settings", name: "Settings", icon: "settings", href: "/settings" },
]

function updateRedirectUrl() {
  const route = useRoute()
  const redirectUrl = useRedirectUrl()
  redirectUrl.value = route.path
}
</script>

<template>
  <div>
    <header
      v-if="!hideHeader"
      class="z-10 fixed bg-transparent pointer-events-none top-0 w-full"
    >
      <div class="navbar bg-transparent">
        <slot name="nav">
          <div class="flex-1" />
        </slot>

        <div class="flex-none bg-transparent pointer-events-auto">
          <div class="flex items-center gap-1">
            <span class="">2000</span>
            <Icon class="text-orange-500">
              trophy
            </Icon>
          </div>
          <!-- <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <div class="indicator">
              <Icon>notifications</Icon>
              <span class="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </div>

          <Menu :items="items" />
        </div> -->
          <div class="dropdown dropdown-end">
            <Avatar type="button" class="w-10" :button="true" @click="updateRedirectUrl" />

            <Menu :items="items" />
          </div>
        </div>
      </div>
    </header>

    <div class="drawer md:drawer-open">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle">

      <main class="drawer-content relative">
        <slot />
      </main>

      <div class="drawer-side">
        <label
          for="my-drawer-2"
          aria-label="close sidebar"
          class="drawer-overlay"
        />

        <ul class="space-y-2 flex flex-col p-4 w-80 min-h-full bg-slate-800 text-teal-500">
          <div class="px-4 py-2 flex items-center gap-1 border-b border-b-slate-900 my-2">
            <Icon class="">
              directions_run
            </Icon>
            <span class="font-bold">Maratongue</span>
          </div>

          <li v-for="item in navItems" :key="item.id" class="flex items-center gap-1 text-teal-500 hover:bg-slate-700 rounded-lg">
            <A
              :href="item.href"
              :class="{ 'bg-white text-black hover:bg-white': route.path === item.href }"
              class="w-full flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300"
            >
              <Icon>{{ item.icon }}</Icon>
              <span v-if="item.name" class="">{{ item.name }}</span>
            </A>
          </li>
        </ul>
      </div>
    </div>

    <div class="btm-nav btm-nav-md flex md:hidden">
      <A
        v-for="item in navItems"
        :key="item.id"
        :href="item.href"
        :class="{ 'active border-t-4 border-red-500': route.path === item.href }"
        class="bg-slate-800 text-teal-500"
      >
        <Icon>{{ item.icon }}</Icon>
        <span v-if="item.name" class="hidden sm:flex btm-nav-label">{{ item.name }}</span>
      </A>
    </div>
  </div>
</template>
