<script setup lang="ts">
import { t } from '@psitta/vue'
import type { MenuItemType } from '~/components/ui/navigation/types'

const user = useUser()
const logout = useLogout()

const localeModal = useLocaleModal()

const menuItems = computed<MenuItemType[]>(() => {
  return [
    { id: 'app', name: t('Access the app'), icon: 'material-symbols:chat-outline-rounded', href: '/app' },
    { id: 'settings', name: t('Account settings'), icon: 'material-symbols:settings-outline-rounded', href: '/settings/account' },
    {
      id: 'language',
      name: t('Language'),
      icon: 'material-symbols:language',
      onClick: () => localeModal.open(),
    },
    {
      id: 'logout',
      name: t('Logout'),
      action: '/api/auth/logout',
      method: 'post',
      icon: 'material-symbols:logout-rounded',
      meaning: 'warning',
      onSubmit: logout,
    },
  ]
})

const redirectUrl = useRedirectUrl()
</script>

<template>
  <div>
    <Header>
      <template #navbar-end>
        <div class="flex items-center gap-2 text-gray-900">
          <div>
            <div v-if="!!user">
              <Dropdown class="dropdown-end">
                <Avatar
                  type="button"
                  size="sm"
                  wrapper-class="bg-neutral text-neutral-content"
                />

                <DropdownContent :items="menuItems" />
              </Dropdown>
            </div>

            <A v-else class="link link-red-500" href="/sign-in" @click="redirectUrl = '/app'">
              {{ t("Sign in") }}
            </A>
          </div>
        </div>
      </template>
    </Header>

    <main class="bg-white flex flex-col" style="min-height: calc(100vh)">
      <div class="w-full max-w-[800px] mx-auto py-12 px-4 bg-white">
        <slot />
      </div>
    </main>

    <Footer />
  </div>
</template>
