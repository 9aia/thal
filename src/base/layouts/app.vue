<script setup lang="ts">
import Avatar from '~/src/ui/components/display/Avatar.vue'
import Icon from '~/src/ui/components/display/Icon.vue'
import Menu from '~/src/ui/components/layout/Menu.vue'
import A from '~/src/base/components/A.vue'
import type { MenuItem } from '~/src/ui/components/layout/types'

withDefaults(
  defineProps<{
    hideHeader?: boolean
  }>(),
  { hideHeader: false },
)

const logout = useLogout()
const route = useRoute()

const items: MenuItem[] = [
  { id: 'profile', name: 'Profile', icon: 'face', href: '/profile' },
  {
    id: 'plan',
    name: 'Plan',
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'subscriptions',
    type: 'external',
  },
  { id: 'settings', name: 'Settings', icon: 'settings', href: '/settings' },
  {
    id: 'logout',
    name: 'Logout',
    action: '/api/auth/logout',
    method: 'post',
    icon: 'logout',
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
    id: 'explore',
    name: 'Explore',
    icon: 'explore',
    href: '/explore',
  },
  // { id: 'missions', name: 'Missions', icon: 'editor_choice', href: '/missions' },
  // { id: "rank", name: "Rank", icon: "trophy", href: "/rank" },
  { id: 'profile', name: 'Profile', icon: 'face', href: '/profile' },
  { id: 'settings', name: 'Settings', icon: 'settings', href: '/settings' },
]

const updateRedirectUrl = () => {
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

      <div class="drawer-content">
        <main class="pb-20 md:pb-0">
          <slot />
        </main>

      <!-- <label for="my-drawer-2" class="btn btn-primary drawer-button md:hidden"
        >Open drawer</label
      > -->
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer-2"
          aria-label="close sidebar"
          class="drawer-overlay"
        />
        <ul class="menu p-4 w-80 min-h-full bg-slate-800 text-base-content">
          <div class="px-4 py-2 flex items-center text-teal-500 border-b border-b-slate-900 my-2 gap-1">
            <Icon class="">
              directions_run
            </Icon>
            <span class="font-bold">Maratongue</span>
          </div>

          <li v-for="item in navItems" :key="item.id">
            <A
              :href="item.href"
              :class="{ active: route.path === item.href }"
              class="text-teal-500 active:text-teal-600"
            >
              <Icon>{{ item.icon }}</Icon>
              <span v-if="item.name" class="btm-nav-label">{{ item.name }}</span>
            </A>
          </li>
        </ul>
      </div>
    </div>
    <div class="btm-nav flex md:hidden bg-slate-800 text-teal-500">
      <A
        v-for="item in navItems"
        :key="item.id"
        :href="item.href"
        :class="{ active: route.path === item.href }"
      >
        <Icon>{{ item.icon }}</Icon>
        <span v-if="item.name" class="hidden sm:flex btm-nav-label">{{ item.name }}</span>
      </A>
    </div>
  </div>
</template>
