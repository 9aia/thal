<script lang="ts" setup>
const logout = useLogout()

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

function updateRedirectUrl() {
  const route = useRoute()
  const redirectUrl = useRedirectUrl()
  redirectUrl.value = route.path
}
</script>

<template>
  <div class="px-3 py-2 bg-slate-800 flex gap-2 border-r border-slate-700 justify-between">
    <A href="/profile" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        >
      </div>
    </A>

    <div class="dropdown dropdown-end">
      <button class="btn btn-square btn-ghost text-primary" @click="updateRedirectUrl">
        <Icon>more_vert</Icon>
      </button>

      <Menu :items="items" />
    </div>
  </div>
</template>
