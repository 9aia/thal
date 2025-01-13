<script setup lang="ts">
import { t } from '@psitta/vue'
import type { MenuItem } from '~/components/ui/navigation/types'

const user = useUser()
const logout = useLogout()

const localeModal = useLocaleModal()

const menuItems: MenuItem[] = [
  { id: 'app', name: 'App', icon: 'chat', href: '/app' },
  { id: 'settings', name: 'Account Settings', icon: 'settings', href: '/settings/account' },
  {
    id: 'language',
    name: 'Language',
    icon: 'language',
    onClick: () => {
      localeModal.open()
    },
  },
  {
    id: 'logout',
    name: 'Logout',
    action: '/api/auth/logout',
    method: 'post',
    icon: 'logout',
    meaning: 'warning',
    onSubmit: logout,
  },
]
</script>

<template>
  <div class="bg-white min-h-screen flex flex-col">
    <!-- <header class="bg-blue-500">
      header
    </header>
    <main class="bg-red-500 flex-1 flex">
      <div class="bg-yellow-500 flex-1">
        main
      </div>
    </main>
    <footer class="bg-green-500 sticky top-[100vh]">
      footer
    </footer> -->

    <Header>
      <template #navbar-end>
        <div class="flex items-center gap-2 text-gray-900">
          <div>
            <div v-if="!!user">
              <div class="dropdown dropdown-end">
                <Avatar
                  type="button" class="w-10 bg-gray-200 text-gray-800" :button="true"
                  @click="updateRedirectUrl"
                />

                <Menu :items="menuItems" item-class="py-2" />
              </div>
            </div>

            <A
              v-else
              class="hover:underline text-gradient-1"
              href="/sign-in"
              active-class="text-gray-900"
            >
              {{ t("Sign in") }}
            </A>
          </div>
        </div>
      </template>
    </Header>

    <main class="bg-white flex-1 flex">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: radial-gradient(theme('colors.green.500'), theme('colors.blue.500'));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
