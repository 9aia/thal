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
      <template #navbar-top>
        <div class="bg-gradient-2 text-xs flex text-center justify-center py-2 px-4 text-blue-500">
          {{ t("Thal is in preview! We are not charging for access. Expect bugs and unfinished features.") }}
        </div>
      </template>

      <template #navbar-end>
        <div class="flex items-center gap-2 text-gray-900">
          <div>
            <div v-if="!!user">
              <div class="dropdown dropdown-end">
                <Avatar
                  type="button"
                  class="w-10 bg-gray-200 text-gray-800"
                  :button="true"
                />

                <Menu :items="menuItems" item-class="py-2" />
              </div>
            </div>

            <A
              v-else
              active-class="text-gray-200 hover:no-underline pointer-events-none"
              class="text-black hover:underline"
              href="/app"
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
.bg-gradient-2 {
  background: radial-gradient(at bottom, theme('colors.blue.50'), theme('colors.gray.50'));
}
</style>
