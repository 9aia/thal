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
  <div class="bg-white">
    <Header>
      <template #navbar-end>
        <div class="flex items-center gap-2 text-gray-900">
          <div>
            <div v-if="!!user">
              <div class="dropdown dropdown-end">
                <Avatar type="button" class="w-10 bg-gray-200 text-gray-800" :button="true" @click="updateRedirectUrl" />

                <Menu :items="menuItems" item-class="py-2" />
              </div>
            </div>

            <A v-else class="link link-primary" href="/sign-in">
              {{ t("Sign in") }}
            </A>
          </div>
        </div>
      </template>
    </Header>

    <main class="bg-white flex flex-col" style="min-height: calc(100vh)">
      <slot />
    </main>

    <Footer />
  </div>
</template>

<style>
* {
  scrollbar-width: auto;
}
</style>
