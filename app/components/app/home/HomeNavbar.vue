<script lang="ts" setup>
import type { MenuItem } from "~~/layers/ui/components/navigation/types"

const logout = useLogout()

const profileModal = useProfileModal()

const user = useUser()

const items: MenuItem[] = [
  { id: "profile", action: "profile", name: "Profile", icon: "face", onSubmit: () => profileModal.open(user.value!.username) },
  {
    id: "plan",
    name: "Subscription",
    action: "/api/payment/stripe/create-portal-session",
    method: "post",
    icon: "subscriptions",
    type: "external",
  },
  { id: "settings", name: "Settings", icon: "settings", for: "settings-drawer" },
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
  <Navbar class="bg-slate-800">
    <Avatar :name="user!.name" class="w-10 text-sm" type="button" @click="profileModal.open(user!.username)" />

    <div class="dropdown dropdown-end">
      <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
        <Icon>more_vert</Icon>
      </button>

      <Menu :items="items" />
    </div>
  </Navbar>
</template>
