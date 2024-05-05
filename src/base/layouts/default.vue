<script setup lang="ts">
import { t } from "@psitta/vue"
import Header from "~/src/ui/components/layout/Header.vue"
import Footer from "~/src/ui/components/layout/Footer.vue"
import type { MenuItem } from "~/src/ui/components/layout/types"

const user = useUser()
const logout = useLogout()

const menuItems: MenuItem[] = [
  { id: "app", name: "App", icon: "explore", href: "/explore" },
  { id: "settings", name: "Account Settings", icon: "settings", href: "/settings/account" },
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
  <div>
    <div class="text-center bg-teal-500 text-slate-800 py-2 px-4">
      We're currently undergoing active development!
    </div>

    <Header>
      <template #navbar-end>
        <div class="flex items-center gap-2 text-slate-900">
          <div>
            <div v-if="!!user">
              <div class="dropdown dropdown-end">
                <Avatar type="button" class="w-10" :button="true" @click="updateRedirectUrl" />

                <Menu :items="menuItems" />
              </div>
            </div>
            <!--  <form v-if="!!user" action="/api/logout" method="post" @submit.prevent="logout">
            <button class="link" type="submit">
              {{ t("Logout") }}
            </button>
          </form> -->

            <A v-else class="link link-primary" href="/sign-in">
              {{ t("Sign in") }}
            </A>
          </div>
        </div>
      </template>
    </Header>

    <main
      class="bg-white flex flex-col"
      style="min-height: calc(100vh)"
    >
      <slot />
    </main>

    <Footer />
  </div>
</template>
