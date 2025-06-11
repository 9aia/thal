<script setup lang="ts">
import { t } from '@psitta/vue'
import type { MenuItemType } from '~/components/ui/navigation/types'

const user = useUser()
const logout = useLogout()
const RUNTIME_ENV = useRuntimeEnv()
const localeModal = useLocaleModal()

const menuItems: MenuItemType[] = [
  { id: 'app', name: 'App', icon: 'material-symbols:chat-outline-rounded', href: '/app' },
  { id: 'settings', name: 'Account Settings', icon: 'material-symbols:settings-outline-rounded', href: '/settings/account' },
  {
    id: 'language',
    name: 'Language',
    icon: 'material-symbols:language',
    onClick: () => {
      localeModal.open()
    },
  },
  {
    id: 'logout',
    name: 'Logout',
    action: '/api/auth/logout',
    method: 'post',
    icon: 'material-symbols:logout-rounded',
    meaning: 'warning',
    onSubmit: logout,
  },
]
</script>

<template>
  <div class="bg-white min-h-screen flex flex-col">
    <Header>
      <template #navbar-top>
        <div
          v-if="RUNTIME_ENV === 'dev' || RUNTIME_ENV === 'preview'"
          class="bg-radial-[at_bottom] from-blue-50 to-gray-50 text-xs flex text-center justify-center py-2 px-4 text-blue-500"
        >
          {{ t("Thal is in preview! We are not charging for access. Expect bugs and unfinished features.") }}
        </div>
      </template>

      <template #navbar-end>
        <div class="flex items-center gap-2 text-gray-900">
          <div>
            <div v-if="!!user">
              <Dropdown class="dropdown-end">
                <Avatar
                  :name="user.name"
                  type="button"
                  wrapper-class="bg-neutral-50 text-neutral-content"
                />

                <DropdownContent :items="menuItems" />
              </Dropdown>
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
