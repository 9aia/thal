<script lang="ts" setup>
import type { MenuItem } from "~~/layers/ui/components/layout/types"

const logout = useLogout()

const profileModal = useProfileModal()

const user = useUser()

const items: MenuItem[] = [
  { id: "profile", action: "profile", name: "Profile", icon: "face", onSubmit: () => profileModal.open(user.value!.username) },
  {
    id: "plan",
    name: "Plan",
    action: "/api/payment/stripe/create-portal-session",
    method: "post",
    icon: "subscriptions",
    type: "external",
  },
  { id: "settings", name: "Settings", icon: "settings", href: "/app/settings" },
  {
    id: "logout",
    name: "Logout",
    action: "/api/auth/logout",
    method: "post",
    icon: "logout",
    onSubmit: logout,
  },
]

function updateRedirectUrl() {
  const route = useRoute()
  const redirectUrl = useRedirectUrl()
  redirectUrl.value = route.path
}
</script>

<template>
  <div class="px-3 py-2 bg-slate-800 flex gap-2 justify-between">
    <div
      role="button"
      class="btn btn-ghost btn-circle avatar"
      @click="profileModal.open(user!.username)"
    >
      <div class="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        >
      </div>
    </div>

    <div class="dropdown dropdown-end">
      <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
        <Icon>more_vert</Icon>
      </button>

      <Menu :items="items" />
    </div>
  </div>

  <slot />
</template>
